import {
  type StartedDockerComposeEnvironment,
  DockerComposeEnvironment,
} from "testcontainers";

let environment: StartedDockerComposeEnvironment;

export async function setup() {
  environment = await new DockerComposeEnvironment(
    "./docker",
    "docker-compose.yaml"
  )
    .withBuild()
    .up();
}

export async function teardown() {
  await environment.down();
}
