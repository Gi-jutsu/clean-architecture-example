import {
  type StartedDockerComposeEnvironment,
  DockerComposeEnvironment,
  Wait,
} from "testcontainers";

let environment: StartedDockerComposeEnvironment;

export async function setup() {
  environment = await new DockerComposeEnvironment(
    "./docker",
    "docker-compose.yaml"
  )
    .withBuild()
    .withWaitStrategy("database-1", Wait.forHealthCheck())
    .up(["database"]);
}

export async function teardown() {
  await environment.down();
}
