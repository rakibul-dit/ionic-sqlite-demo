export const dataToImport = {
  database: 'db-from-json',
  version: 1,
  encrypted: false,
  mode: 'full',
  tables: [
    {
      name: 'users',
      schema: [
        { column: 'id', value: 'INTEGER PRIMARY KEY NOT NULL' },
        { column: 'email', value: 'TEXT UNIQUE NOT NULL' },
        { column: 'name', value: 'TEXT' },
        { column: 'age', value: 'INTEGER' },
        { column: 'sql_deleted', value: 'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))' },
        { column: 'last_modified', value: "INTEGER DEFAULT (strftime('%s', 'now'))" },
      ],
      indexes: [
        { name: 'index_user_on_name', value: 'name' },
        { name: 'index_user_on_last_modified', value: 'last_modified DESC' },
        {
          name: 'index_user_on_email_name',
          value: 'email ASC, name',
          mode: 'UNIQUE',
        },
      ],
      values: [
        [1, 'Whiteley.com', 'Whiteley', 30, 0, 1582536810],
        [2, 'Jones.com', 'Jones', 44, 0, 1582812800],
        [3, 'Simpson@example.com', 'Simpson', 69, 0, 1583570630],
        [4, 'Brown@example.com', 'Brown', 15, 0, 1590383895],
      ],
    },
    {
      name: 'messages',
      schema: [
        { column: 'id', value: 'INTEGER PRIMARY KEY NOT NULL' },
        { column: 'userid', value: 'INTEGER' },
        { column: 'title', value: 'TEXT NOT NULL' },
        { column: 'body', value: 'TEXT NOT NULL' },
        { column: 'sql_deleted', value: 'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))' },
        { column: 'last_modified', value: "INTEGER DEFAULT (strftime('%s', 'now'))" },
        {
          foreignkey: 'userid',
          value: 'REFERENCES users(id) ON DELETE CASCADE',
        },
      ],
      indexes: [
        { name: 'index_messages_on_title', value: 'title' },
        {
          name: 'index_messages_on_last_modified',
          value: 'last_modified DESC',
        },
      ],
      values: [
        [1, 1, 'test post 1', 'content test post 1', 0, 1587310030],
        [2, 2, 'test post 2', 'content test post 2', 0, 1590388125],
        [3, 1, 'test post 3', 'content test post 3', 0, 1590383895],
      ],
    },
  ],
};

export const partialData = {
  database: 'db-from-json',
  version: 1,
  encrypted: false,
  mode: 'partial',
  tables: [
    {
      name: 'users',
      values: [
        [5, 'Addington.com', 'Addington', 22, 0, 1601972413],
        [6, 'Bannister.com', 'Bannister', 59, 0, 1601983245],
        [2, 'Jones@example.com', 'Jones', 45, 0, 1601995473],
        [1, 'Whiteley.com', 'Whiteley', 30, 1, 1601995520],
      ],
    },
  ],
};

export const partialImport = {
  database: 'db-from-json',
  version: 1,
  encrypted: false,
  mode: 'partial',
  tables: [
    {
      name: 'users',
      values: [
        [5, 'Addington.com', 'Addington', 22, 0, 1601972413],
        [6, 'Bannister.com', 'Bannister', 59, 0, 1601983245],
        [2, 'Jones@example.com', 'Jones', 45, 0, 1601995473],
        [1, 'Whiteley.com', 'Whiteley', 30, 0, 1601995520],
      ],
    },
    {
      name: 'messages',
      indexes: [{ name: 'index_messages_on_title', value: 'title' }],
      values: [
        [4, 2, 'test post 4', 'content test post 4', 0, 1601983742],
        [5, 6, 'test post 5', 'content test post 5', 0, 1601992872],
        [1, 1, 'test post 1', 'content test post 1', 1, 1601995520],
        [3, 1, 'test post 3', 'content test post 3', 1, 1601995520],
      ],
    },
    {
      name: 'fruits',
      schema: [
        { column: 'id', value: 'INTEGER PRIMARY KEY NOT NULL' },
        { column: 'name', value: 'TEXT UNIQUE NOT NULL' },
        { column: 'weight', value: 'REAL' },
        { column: 'sql_deleted', value: 'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))' },
        { column: 'last_modified', value: "INTEGER DEFAULT (strftime('%s', 'now'))" },
      ],
      indexes: [
        { name: 'index_fruits_on_name', value: 'name' },
        { name: 'index_fruits_on_last_modified', value: 'last_modified DESC' },
      ],
      values: [
        [1, 'orange', 200.3, 0, 1601995573],
        [2, 'apple', 450.0, 0, 1601995573],
        [3, 'banana', 120.5, 0, 1601995573],
      ],
    },
    {
      name: 'company',
      schema: [
        { column: 'id', value: 'INTEGER NOT NULL' },
        { column: 'name', value: 'TEXT NOT NULL' },
        { column: 'age', value: 'INTEGER NOT NULL' },
        { column: 'address', value: 'TEXT' },
        { column: 'salary', value: 'REAL' },
        { column: 'sql_deleted', value: 'BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))' },
        { column: 'last_modified', value: "INTEGER DEFAULT (strftime('%s', 'now'))" },
        { constraint: 'PK_id_name', value: 'PRIMARY KEY (id,name)' },
      ],
    },
  ],
};
