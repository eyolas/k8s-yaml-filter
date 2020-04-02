# k8s-yaml-filter

### Installation

```sh
npm i -g k8s-yaml-filter
```

### usage

```sh
k8sf [-i type,type] [-o type,type]
```

Takes stdin, selects only objects in the 'in_filter', discards
objects in the 'out_filter', and writes the result to stdout.


The use case is with e.g. Kubernetes, you have a YAML file
which has CRD, webhook, and objects using these.

By default filter for kind

Apply the same YAML 3 times:
```sh
cat foo.yaml | k8sf -i CustomResourceDefinition | kubectl apply -f -
cat foo.yaml | k8sf -i ValidatingWebhookConfiguration | kubectl apply -f -
cat foo.yaml | kubectl apply -f -
```

on the last run you could choose

-o CustomResourceDefinition,ValidatingWebhookConfiguration

but its a bit moot since Kubernetes will properly apply the unchanged
CRD and WebHook


filter on other field:
```sh
cat foo.yaml | k8sf -i metadata/namespace=kong,metadata/name=kong | kubectl apply -f -
```