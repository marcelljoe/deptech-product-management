import { exeQuery } from "../../../lib/db";
import { IInsert } from "../../../interfaces/menu.interface";

export const getMenu = (username: string) => {
  const syntax = `SELECT A.id menu_header, A.description menu, A.path, A.level, A.header sub, A.icon, 
            B.m_insert, B.m_update, B.m_delete, B.m_approve, B.m_view
        FROM menu A, access_det B, access C, user_mobile D 
        WHERE A.id = B.menuId
        AND B.accessId = C.id
        AND C.id = D.accessId
        AND D.username = ?
        AND B.m_view = 1
        ORDER BY A.sort`;

  return exeQuery(syntax, [username]);
};

export const listAll = (type: string | number) => {
  var whereStatus = "";
  if (type == 1) {
    whereStatus = ` AND A.status = '1' `;
  }

  var syntax = `SELECT A.id menu_header, A.description menu, level, header sub, 0 AS m_insert, 0 AS m_update,
    0 AS m_delete, 0 AS m_view, 0 AS m_approve, 0 AS sort, 0 AS access_det_id, path, A.status, A.sort
    FROM menu A WHERE 0 = 0 ${whereStatus} ORDER BY A.sort ASC`;
  return exeQuery(syntax, []);
};

export const findOneRole = (description: string) => {
  const syntax = `SELECT id FROM access A WHERE A.description = ?`;
  return exeQuery(syntax, [description]);
};

export const listLeftAccess = (accessId: string) => {
  const syntax = `SELECT A.id menu_header, A.description menu, A.path, A.level, A.header sub, B.id AS access_det_id, 
    B.m_insert, B.m_update, B.m_delete, B.m_view, A.sort
    FROM menu A
    LEFT JOIN (SELECT id, m_insert, m_update, m_delete, m_view, m_approve, menuId FROM access_det WHERE access_det.accessId = ?) B 
    ON B.menuId = A.id ORDER BY A.sort`;

  return exeQuery(syntax, [accessId]);
};

export const findOne = (param: IInsert) => {
  const syntax = `SELECT A.description headDesc, A.level headLevel, A.path headPath,
    B.description childDesc, B.level childDesc, B.header childDesc, B.path childPath, B.status childStatus
    FROM menu A, menu B WHERE A.id = B.header AND A.description = ?`;
  return exeQuery(syntax, [param.description]);
};

export const save = (param: IInsert) => {
  const syntax = `INSERT INTO menu (description, status, path, header, level, icon, sort, createdById) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  return exeQuery(syntax, [
    param.description,
    param.status || "",
    param.path,
    param.header,
    param.level,
    param.icon || "",
    param.sort,
    param.userId,
  ]);
};

export const findLatestMenu = (header: string) => {
  var whereHeader = "";
  if (header) {
    whereHeader = `WHERE id = ${header}`;
  }

  const syntax = `SELECT sort FROM menu ${whereHeader} ORDER BY sort DESC LIMIT 1`;
  return exeQuery(syntax, []);
};

export const getMenuId = (param: { sort: any }) => {
  const syntax = `SELECT id, sort FROM menu WHERE sort > ?`;
  return exeQuery(syntax, [param.sort]);
};

export const updateManySort = (stx: string) => {
  var syntax = `UPDATE menu SET sort = CASE id ${stx}`;
  return exeQuery(syntax, []);
};

export const findIdMenu = (param: IInsert) => {
  const syntax = `SELECT id FROM menu A WHERE A.description = ?`;
  return exeQuery(syntax, [param.description]);
};

export const deleteOne = (id: string) => {
  const syntax = `DELETE FROM menu WHERE id = ? OR header = ?`;
  return exeQuery(syntax, [id, id]);
};

export const updateOne = (param: IInsert) => {
  const syntax = `UPDATE menu SET description = ?, status = ?, path = ?, header = ?, 
    level = ?, icon = ?, updatedById = ? WHERE description = ?`;
  return exeQuery(syntax, [
    param.description,
    param.status || "",
    param.path,
    param.sub,
    param.level,
    param.icon ? param.icon : "",
    param.userId,
    param.id || "",
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
