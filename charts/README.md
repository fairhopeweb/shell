# Helm Charts

## Requirement

- Each Chart in this directory must be contained within a subdirectory that matches the name of the chart specified in the `Chart.yaml` file.
  - **This name must not conflict with any other package in https://github.com/orgs/cased/packages**.
- Chart versions are tracked in the `Chart.yaml` file, not with Git tags like our other OCI images.
  - To denote a new development version, use `N.N.N-alpha.N`.
  - To denote a new release, use `N.N.N`.

## Testing

From the root of the project, unit tests can be run quickly:

```shell
make -C charts test
```

Docs, lint, unit, and integration tests can all be run with:

```shell
yarn charts:build
```

All run on push.

## Releases

To publish your chart with our [GitHub Actions Workflow](.github/workflows/charts.yml), either;

- Add the `helm:push` label to your PR, or
- Merge a PR to the default branch.
