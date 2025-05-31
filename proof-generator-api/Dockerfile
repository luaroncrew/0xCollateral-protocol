FROM node:20-bullseye-slim


WORKDIR /app

COPY . .

# Install bun
RUN apt-get update && apt-get install -y curl && \
    apt-get install unzip && \
    curl -fsSL https://bun.sh/install | bash

RUN bun install


# Step 1: Install vlayerup and manually move it into PATH
RUN curl -SL https://install.vlayer.xyz | bash

ENTRYPOINT [ "bash" ]



