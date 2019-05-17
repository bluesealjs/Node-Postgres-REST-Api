const express = require("express");
const router = express.Router();
const moment = require("moment");
const uuidv4 = require("uuid/v4");
const db = require("../../db/index");

/**
 * Create A Reflection
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
router.post("", async (req, res) => {
  const text = `INSERT INTO
      reflections(id, success, low_point, take_away, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *`;
  const values = [
    uuidv4(),
    req.body.success,
    req.body.low_point,
    req.body.take_away,
    moment(new Date()),
    moment(new Date())
  ];

  try {
    const { rows } = await db.query(text, values);
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
/**
 * Get All Reflection
 * @param {object} req
 * @param {object} res
 * @returns {object} reflections array
 */
router.get("", async (req, res) => {
  const findAllQuery = "SELECT * FROM reflections";
  try {
    const { rows, rowCount } = await db.query(findAllQuery);
    return res.status(200).json({ rows, rowCount });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
/**
 * Get A Reflection
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
router.get("/:id", async (req, res) => {
  const text = "SELECT * FROM reflections WHERE id = $1";
  try {
    const { rows } = await db.query(text, [req.params.id]);
    if (!rows[0]) {
      return res.status(404).json({ message: "reflection not found" });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
/**
 * Update A Reflection
 * @param {object} req
 * @param {object} res
 * @returns {object} updated reflection
 */
router.put("/:id", async (req, res) => {
  const findOneQuery = "SELECT * FROM reflections WHERE id=$1";
  const updateOneQuery = `UPDATE reflections
      SET success=$1,low_point=$2,take_away=$3,modified_date=$4
      WHERE id=$5 returning *`;
  try {
    const { rows } = await db.query(findOneQuery, [req.params.id]);
    if (!rows[0]) {
      return res.status(404).json({ message: "reflection not found" });
    }
    const values = [
      req.body.success || rows[0].success,
      req.body.low_point || rows[0].low_point,
      req.body.take_away || rows[0].take_away,
      moment(new Date()),
      req.params.id
    ];
    const response = await db.query(updateOneQuery, values);
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
/**
 * Delete A Reflection
 * @param {object} req
 * @param {object} res
 * @returns {void} return statuc code 204
 */
router.delete("/:id", async (req, res) => {
  const deleteQuery = "DELETE FROM reflections WHERE id=$1 returning *";
  try {
    const { rows } = await db.query(deleteQuery, [req.params.id]);
    if (!rows[0]) {
      return res.status(404).json({ message: "reflection not found" });
    }
    return res.status(204).json({ message: "deleted" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;

/*
HTTP Status Code 204: 
The server has successfully fulfilled the request and that there is no additional 
content to send in the response payload body.
*/
