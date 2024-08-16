import { exeQuery } from "../../../lib/db";
// import dayjs from 'dayjs'

interface IParams {
  row: string | number;
  page: string | number;
  key: string;
  direction: string;
  column: string;
  limit: number | string;
}

const orderBy = (direction: string, column: string) => {
  const directionType =
    direction == "ascend" ? "ASC" : direction == "descend" ? "DESC" : "";
  if (column == "" || directionType == "") {
    return " ORDER BY id ASC";
  } else {
    return ` ORDER BY ${column}  ${directionType}`;
  }
};

const keyWhere = (key: string) => {
  if (key == "") {
    return "";
  } else {
    return ` WHERE (name LIKE "%${key}%" OR sender LIKE "%${key}%" OR id_number LIKE "%${key}%" ) `;
  }
};

export const countLists = (params: IParams) => {
  let countQuery = `SELECT COUNT(*) AS counts FROM black_list ${keyWhere(
    params.key
  )}`;
  return exeQuery(countQuery, []);
};

export const listBlacklists = (params: IParams) => {
  let listQuery = `SELECT id, name, sender, id_number FROM black_list${keyWhere(
    params.key
  )}${orderBy(params.direction, params.column)} ${params.limit}`;
  return exeQuery(listQuery, []);
};

export const detailList = (id: string) => {
  let queryDetail = `SELECT * FROM black_list WHERE id = ?`;
  return exeQuery(queryDetail, [id]);
};

export const searchList = (sender: string, id: any, type: string) => {
  let edit = `SELECT COUNT(*) AS counts FROM black_list WHERE sender=? AND id!=?`;
  let insert = `SELECT * FROM black_list WHERE sender= ?`;
  if (type == "edit") {
    return exeQuery(edit, [sender, id]);
  } else {
    return exeQuery(insert, [sender]);
  }
};

export const insertList = (
  name: string,
  sender: string,
  idNumber: string,
  userId: number
) => {
  let queryInsert = `INSERT INTO black_list(name,sender, id_number, createdById) VALUES (?,?,?,?)`;
  return exeQuery(queryInsert, [name, sender, idNumber, userId]);
};

export const editList = (
  name: string,
  sender: string,
  idNumber: string,
  id: string,
  userId: number
) => {
  let editUserQuery = `UPDATE black_list SET name = ?, sender = ?, id_number = ?, updatedById = ? WHERE id = ?`;
  return exeQuery(editUserQuery, [name, sender, idNumber, userId, id]);
};

export const deleteList = (id: string) => {
  let queryDelete = `UPDATE black_list SET is_deleted = 1 WHERE id = ?`;
  return exeQuery(queryDelete, [id]);
};

export const updateUserId = (id: string, userId: string) => {
  return exeQuery("UPDATE black_list SET id_user = ? WHERE id = ?", [
    userId,
    id,
  ]);
};

export const startTransaction = () => {
  return exeQuery("START TRANSACTION", []);
};

export const commitTransaction = () => {
  return exeQuery("COMMIT", []);
};

export const rollback = () => {
  return exeQuery("ROLLBACK", []);
};
