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
    .withWaitStrategy(
      "api-1",
      Wait.forHttp("/health-check", 8080).forStatusCode(200)
    )
    .up();
}

export async function teardown() {
  await environment.down();
}
