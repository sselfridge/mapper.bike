const users = {
  update,
  updateTokens,
  updatePartial,
  get,
  getAll,
  exists,
};

function update() {
  console.log("update should not have been called");
}

function updateTokens() {
  console.log("updateTokens should not have been called");
}

function updatePartial() {
  console.log("updatePartial should not have been called");
}

function get() {
  console.log("get should not have been called");
}

function getAll() {
  console.log("getAll should not have been called");
}

function exists() {
  console.log("exists should not have been called");
}

function remove() {
  console.log("remove should not have been called");
}

function batchDelete() {
  console.log("batchDelete should not have been called");
}

module.exports = users;
