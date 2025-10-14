import { capitalizeFirstLetter, replaceUnderscoreAndCapitalizeFirstLetter } from "@/utils/formatting";
import TableToolbox from "./tableToolbox";

interface iMagixTableProps<T = Record<string, any>> {
    keys: Array<string>;
    rowIdKey?: string;
    items: Array<T>;
    onClickDelete?: (item: T) => void;
    onClickEdit?: (item: T) => void;
    onClickItem?: (item: T) => void;
}

const styleClass = {
    tableData: "p-2 text-start border-solid border border-black dark:border-white",
    tableContainer: "border-solid border border-white outline outline-1 outline-gray-400 overflow-hidden rounded-lg"
}

export default function MagixTable<T = Record<string, any>>({
    keys,
    items,
    onClickDelete = () => {},
    onClickEdit = () => {},
    onClickItem = () => {},
    rowIdKey = "id"
}: iMagixTableProps<T>) {
    return (
        <table className={styleClass.tableContainer}>
            <thead>
                <tr>
                    {
                        keys.map((key) => {
                            const headingLabel = replaceUnderscoreAndCapitalizeFirstLetter(key)
                            return (
                                <th key={`heading-${key}`} className={styleClass.tableData}>{headingLabel}</th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {items.map(t => (
                    <tr onClick={() => onClickItem(t)} key={t[rowIdKey]}>
                        {
                            keys.map(key => {
                                const isAction = key === 'action'
                                return (
                                    <td key={t[rowIdKey] + "-" + key} className={styleClass.tableData}>
                                        {isAction ? (
                                            <TableToolbox
                                                onClickDelete={() => { onClickDelete(t) }}
                                                onClickEdit={() => { onClickEdit(t) }} 
                                            />
                                        ) : t[key]
                                        }
                                    </td>
                                )
                            })
                        }
                    </tr>
                ))}
            </tbody>
        </table>
    )
}