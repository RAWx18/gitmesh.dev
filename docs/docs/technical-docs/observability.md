---
description: >-
  Learn how GitMesh CE uses OpenTelemetry for end-to-end observability across
  services.
---

# 🎯 Observability

### Running SigNoz locally

We use Signoz as an example but any OpenTelemetry stack/collector works.

Get Signoz up and running:

```bash
$ git clone -b main https://github.com/SigNoz/signoz.git
$ cd signoz/deploy/
$ docker-compose -f docker/clickhouse-setup/docker-compose.yaml up -d
```

### Using the tracing library

<pre class="language-javascript"><code class="lang-javascript">// Just like `getServiceLogger()`, `getServiceTracer()` returns a
// new instance of a fully configured tracer, or the existing one if
// already initialized.
import { getServiceTracer, SpanStatusCode } from '@gitmesh/tracing'

// Get the service's tracer. Only one tracer per service shall
// be created. Tracer details are retrieved from environment variables
// as detailed in the next section. Most of the time, the tracer is
// already accessible in `this.tracer`.
const tracer = getServiceTracer()

// Start a span, and leverage the OpenTelemetry Span API for
// adding events, setting status, etc. Make sure to always end
// the span, regardless the status.
tracer.startActiveSpan('ProcessMessage', async (span: Span) => {
  try {
    // Do something...
    span.setStatus({
      code: SpanStatusCode.OK,
    })
  } catch (err) {
<strong>    span.setStatus({
</strong>      code: SpanStatusCode.ERROR,
      message: err,
    })
  } finally {
    span.end()
  }
})
</code></pre>

### Automatic instrumentation and correlation

All libraries (Bunyan, Sequelize, Redis, SQS, Express) access the context of the active span in order to automatically instrument tracing:

```javascript
this.tracer.startActiveSpan('ProcessMessage', async (span: Span) => {
    // Context is automatically used by libraries
})
```

Linking logs to traces is critical as it allows to view logs for a trace across services or within a specific span. Correlation between logs and traces is automatic. It is done by leveraging the active span's context as shown above.

However, if for some reasons you still need to manually add trace details to logs, it's possible to do so using:

```javascript
import { addTraceToLogFields } from '@gitmesh/tracing'

const fields = addTraceToLogFields(span, {
  // Other fields...
})

this.log.warn(fields, 'Message')
```

`addTraceToLogFields` extracts `trace_id` and `span_id` from a span, and returns an object including those fields merged with other fields initially passed as second params, if any.

### Environment variables

The `SERVICE` environment variable is required, and allows to set the service name to traces produced by a process. Example:

```bash
SERVICE=data-sink-worker
```

The library complies to all OpenTelemetry environment variables:

* [https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/](https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/)

As well as the ones for the OpenTelemetry Protocol Exporter:

* [https://opentelemetry.io/docs/specs/otel/protocol/exporter/](https://opentelemetry.io/docs/specs/otel/protocol/exporter/)

So, basic configuration would happen with following environment variables:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
OTEL_SDK_DISABLED=false
```

`OTEL_SDK_DISABLED` environment variable allows to enable/disable tracing on the fly, without modifying the code. This is really useful to try out tracing of a service in production for real-life workloads for a few minutes before going live for real, or to disable tracing for a short period of time in case of issues with the OpenTelemetry stack.
