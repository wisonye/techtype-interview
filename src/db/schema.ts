export interface Property {
    //
    // The unique ID, which serves as the primary key, can be either a UUID
    // string or an auto-incrementing integer.
    //
    id?: number;
    //
    // To indicate that the owner of this property, which serves as a foreign
    // key in database
    //
    node_id: number;
    //
    // key, value pair
    //
    key: string;
    value: number;
}

export interface Node {
    //
    // The unique ID, which serves as the primary key, can be either a UUID
    // string or an auto-incrementing integer.
    //
    id?: number;
    //
    // The name that is displayed in UI
    //
    name: string;
    //
    // The unique query path, e.g. `/root/parent/child`, this will be
    // manipulated automatically when be saving or updating.
    //
    path: string;
    //
    // The parent node id
    //
    parent_id?: number;
    //
    // Optional create time (not sure I will use it or not, just put it there)
    //
    created_at?: string;
    //
    // Associated properties
    //
    props?: Property[]
    //
    // Sub nodes
    children?: Node[]
}
