<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Client;
use Google_Client;
use Google\Service\YouTube;
use Google\Service\YouTube\VideoSnippet;
use Google\Service\YouTube\VideoStatus;
use Google\Service\YouTube\Video;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class YouTubeController extends Controller
{
    protected $client;

    public function __construct()
    {
        // Initialize the Google Client
        $this->client = new Client();
        $this->client->setAuthConfig(config('services.google.keys_path'));
        $this->client->setRedirectUri(route('youtube.callback'));
        $this->client->setScopes([
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtube'
        ]);
        $this->client->setAccessType('offline');
        $this->client->setPrompt('consent');
    }

    // /**
    //  * Show the upload form.
    //  */
    public function showUploadForm()
    {
        return Inertia::render('upload/index', [
            'isAuthenticated' => session()->has('youtube_access_token'),

        ]);
    }

    /**
     * Redirect to Google's authentication page.
     */
    public function connect()
    {
        return Redirect::to($this->client->createAuthUrl());
    }

    /**
     * Handle the callback from Google.
     */
    public function callback(Request $request)
    {
        if ($request->has('code')) {
            // Exchange the authorization code for an access token
            $accessToken = $this->client->fetchAccessTokenWithAuthCode($request->get('code'));

            // Store the access token in the session
            Session::put('youtube_access_token', $accessToken);

            return Redirect::route('youtube.upload_form')->with('success', 'Connected to YouTube successfully!');
        }

        return Redirect::route('youtube.upload_form')->with('error', 'Failed to connect to YouTube.');
    }

    /**
     * Handle the video upload.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video' => 'required|file|mimetypes:video/mp4,video/mpeg,video/quicktime|max:50000', // Max 50MB for demo
        ]);

        $accessToken = Session::get('youtube_access_token');
        if (!$accessToken) {
            return Redirect::route('youtube.connect');
        }

        $this->client->setAccessToken($accessToken);

        // Handle expired token
        if ($this->client->isAccessTokenExpired()) {
            // If we have a refresh token, use it to get a new access token
            if ($this->client->getRefreshToken()) {
                $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
                Session::put('youtube_access_token', $this->client->getAccessToken());
            } else {
                // No refresh token, re-authenticate
                return Redirect::route('youtube.connect');
            }
        }

        $youtube = new YouTube($this->client);

        try {
            $videoPath = $request->file('video')->getPathname();

            // 1. Create the snippet
            $snippet = new VideoSnippet();
            $snippet->setTitle($request->input('title'));
            $snippet->setDescription($request->input('description'));
            // Optional: $snippet->setTags(['laravel', 'youtube', 'api']);
            // Optional: $snippet->setCategoryId("22"); // See https://developers.google.com/youtube/v3/docs/videoCategories/list

            // 2. Set the status
            $status = new VideoStatus();
            $status->setPrivacyStatus('unlisted'); // 'private', 'public', or 'unlisted'

            // 3. Associate snippet and status with a new video object
            $video = new Video();
            $video->setSnippet($snippet);
            $video->setStatus($status);

            // 4. Specify the chunk size for the upload
            $chunkSizeBytes = 1 * 1024 * 1024; // 1MB

            // 5. Set the defer flag to true to get a resumable upload URL
            $this->client->setDefer(true);

            // 6. Create the upload request
            $insertRequest = $youtube->videos->insert('status,snippet', $video);

            // 7. Create a MediaFileUpload object for resumable uploads
            $media = new \Google\Http\MediaFileUpload(
                $this->client,
                $insertRequest,
                'video/*',
                null,
                true,
                $chunkSizeBytes
            );
            $media->setFileSize(filesize($videoPath));

            // 8. Read the file and upload chunk by chunk
            $uploadStatus = false;
            $handle = fopen($videoPath, "rb");
            while (!$uploadStatus && !feof($handle)) {
                $chunk = fread($handle, $chunkSizeBytes);
                $uploadStatus = $media->nextChunk($chunk);
            }
            fclose($handle);

            // The upload is complete
            $this->client->setDefer(false);



            return Redirect::route('youtube.upload_form')
                ->with('success', "Video uploaded successfully! Video ID is: {$uploadStatus['id']}");
        } catch (\Google_Service_Exception $e) {
            return Redirect::route('youtube.upload_form')->with('error', 'Google API Error: ' . $e->getMessage());
        } catch (\Exception $e) {
            return Redirect::route('youtube.upload_form')->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }
}
