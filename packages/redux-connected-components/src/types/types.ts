export enum FieldType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    PARAGRAPH = 'PARAGRAPH',
    DATE = 'DATE',
    BOOLEAN = 'BOOLEAN',
    SELECT = 'SELECT',
    URL = 'URL',
}

export type FieldOption = {
    key: string;
    title: string;
};

export type Field = {
    key: string;
    title: string;
    fieldType: FieldType;
    fieldOptions?: FieldOption[];
};

export enum ColumnType {
    TEXT = 'TEXT',
    TWO_LINER = 'TWO_LINER',
    THUMBNAIL = 'THUMBNAIL',
    PRICE = 'PRICE',
    DATE = 'DATE',
    ACTIONS = 'ACTIONS',
}

export type ColumnConfig = {
    key: string;
    title: string;
    width: number;
    columnType: ColumnType;
    actions?: ColumnAction[];
};

export type ColumnAction = {
    id: string;
    title: string;
    icon: string;
};

export enum FilterType {
    VALUE = 'VALUE',
    RANGE = 'RANGE',
    DATE_RANGE = 'DATE_RANGE',
}

export type FilterOption = {
    key: string;
    title: string;
    params: string[];
};

export type FilterConfig = {
    key: string;
    title: string;
    type: FilterType;
    options: FilterOption[];
    allowMultiSelect?: true;
};

export type FilterValue = {
    config: FilterConfig;
    value: FilterOption[];
};

export type FilterValues = Record<string, FilterValue>;

export type Message = {
    id: string;
    content: string;
    timestamp: number;
    isMe?: boolean;
};

export type Chat = {
    id: string;
    title: string;
    items: Message[];
    badge?: number;
};

export type Chats = Record<string, Chat>;

export enum SortOrder {
    NONE = 'NONE',
    ASCENDING = 'ASCENDING',
    DESCENDING = 'DESCENDING',
}

export type SortOrders = Record<string, SortOrder>;

export interface Item {
    id: string;
    [key: string]: string;
}

export type CellProps = {
    item: Item;
    column: ColumnConfig;
    onActionClick?: (actionId: string, item: Item) => void;
};
