const pool = require('./PostgresSQL.js');

async function getAllItems() {
    const { rows } = await pool.query("SELECT * FROM items");
    return rows;
}

async function searchItems(query) {
    const { rows } = await pool.query("SELECT * FROM items WHERE LOWER(name) LIKE LOWER(($1))", [`%${query}%`]);
    return rows;
}

async function getAllCatagories() {
    const { rows } = await pool.query("SELECT DISTINCT catagory FROM items");
    return rows;
}

async function getCertainCatagory(query) {
    if(query != 'All') {
        const { rows } = await pool.query("SELECT * FROM items WHERE catagory=($1)", [query]);
        return rows
    } else {
        const { rows } = await pool.query("SELECT * FROM items");
        return rows;
    }
}

async function getSearchAndCat(query, cat) {
    if(cat != 'All') {
        const { rows } = await pool.query("SELECT * FROM items WHERE LOWER(name) LIKE LOWER(($1)) AND catagory=($2)", [`%${query}%`, cat]);
        return rows;
    } else {
        const { rows } = await pool.query("SELECT * FROM items WHERE LOWER(name) LIKE LOWER(($1))", [`%${query}%`]);
        return rows;
    }
}

async function addItem(name, catagory, quantity, des, notes) {
    const { rows } = await pool.query("SELECT * FROM items WHERE LOWER(name)=LOWER(($1))", [name]);
    if(rows.length > 0) {
        return false;
    } else {
        await pool.query("INSERT INTO items (name, catagory, quantity, description, notes) VALUES ($1, $2, $3, $4, $5)", [name, catagory, quantity, des, notes]);
        return true;
    }
}

async function deleteWithId(id) {
    await pool.query("DELETE FROM items WHERE id=($1)", [id]);
}

async function getWithId(id) {
    const { rows } = await pool.query("SELECT * FROM items WHERE id=($1)", [id]);
    return rows;
}

async function updateItem(id, name, catagory, quantity, des, notes) {
    await pool.query("UPDATE items SET name=($2), catagory=($3), quantity=($4), description=($5), notes=($6) WHERE id=($1)", [id, name, catagory, quantity, des, notes]);
}

module.exports = {
    getAllItems,
    searchItems,
    getAllCatagories,
    getCertainCatagory,
    getSearchAndCat,
    addItem,
    getWithId,
    updateItem,
    deleteWithId
}