FROM golang:1.24@sha256:4c0a1814a7c6c65ece28b3bfea14ee3cf83b5e80b81418453f0e9d5255a5d7b8 AS builder

ARG CMD
ARG VERSION

WORKDIR /app

COPY . .

RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags "-X main.version=${VERSION}" -o /app-out/${CMD} cmd/${CMD}/main.go

FROM alpine:3.21@sha256:a8560b36e8b8210634f77d9f7f9efd7ffa463e380b75e2e74aff4511df3ef88c

ARG CMD

RUN apk --no-cache add ca-certificates

WORKDIR /app

COPY --from=builder /app-out/${CMD} /app/server

ENTRYPOINT ["/app/server"]
