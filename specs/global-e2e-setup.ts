import {
  DockerComposeEnvironment,
  type StartedDockerComposeEnvironment,
} from "testcontainers";

let environment: StartedDockerComposeEnvironment;

export async function setup() {
  environment = await new DockerComposeEnvironment("docker", [
    "docker-compose.yaml",
  ]).up();
}

export async function teardown() {
  await environment.down();
}
