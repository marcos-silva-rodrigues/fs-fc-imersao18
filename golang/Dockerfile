FROM golang:1.22.5-alpine3.20 as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY cmd/events/main.go ./main.go
COPY internal ./internal
COPY docs ./docs

RUN CGO_ENABLED=0 GOOS=linux go build -o /golang-api

FROM debian:bullseye-slim as prod
WORKDIR /app

COPY --from=builder /golang-api /golang-api

EXPOSE 8080
CMD ["/golang-api"]