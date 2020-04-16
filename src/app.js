const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const verifyId = (req, res, next) => {
  const { id } = req.params;

  const indexId = repositories.findIndex((repo) => repo.id == id);

  if (indexId < 0 || !isUuid(id)) {
    return res.status(400).json({ error: "id not valid" });
  }

  req.indexRepo = indexId;

  next();
};

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", verifyId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repo = {
    id,
    title,
    url,
    techs,
    likes: repositories[request.indexRepo].likes,
  };

  repositories[request.indexRepo] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", verifyId, (request, response) => {
  repositories.splice(request.indexRepo, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", verifyId, (request, response) => {
  repositories[request.indexRepo].likes += 1;

  return response.json(repositories[request.indexRepo]);
});

module.exports = app;
