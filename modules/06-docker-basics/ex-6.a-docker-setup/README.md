# Exercise 6.A: Getting Started with Docker

## Goal:

1. Install Docker
2. Verify it works
3. Run a containerized web server
4. Serve your own HTML content using Docker and Nginx.

---

## Part 1: Install Docker

Install Docker Desktop for your OS:

- **Windows:** https://docs.docker.com/desktop/install/windows-install/
- **macOS:** https://docs.docker.com/desktop/install/mac-install/
- **Linux:** https://docs.docker.com/engine/install/

Start Docker Desktop. You may need to restart your machine.

## Part 2: Run Your First Docker Container

Run this command in your terminal:

```bash
docker run hello-world
```

This downloads and runs a small container that prints a success message.

## Part 3: Run a Web Server with Docker

Run the Nginx web server in a container:

```bash
docker run -d -p 8080:80 nginx
```

Now visit [http://localhost:8080](http://localhost:8080) in your browser. You should see the default Nginx welcome page.

Stop the container afterward:

```bash
docker ps    # Get the container ID
docker stop <container-id>
```

## Part 4: Serve a Custom HTML Page

Let’s serve your own HTML file with Nginx.

1. Create a new directory on your machine:

```bash
mkdir my-nginx
cd my-nginx
```

2. Create a file named `index.html` with any content you like:

```html
<!-- my-nginx/index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Hello from Docker</title>
</head>
<body>
  <h1>My Custom Page</h1>
  <p>This page is served by Docker and Nginx!</p>
</body>
</html>
```

3. Run the Nginx container using your HTML file as the content:

```bash
docker run -d -p 8080:80 -v $(pwd)/index.html:/usr/share/nginx/html/index.html nginx
```

4. Visit [http://localhost:8080](http://localhost:8080) in your browser. You should see **your** custom HTML page!

If you're using Windows PowerShell, replace `$(pwd)` with `${PWD}`.

## Video Recording

Record a 1-minute (approximately) video of the following:

- In your terminal, run `docker run hello-world` and show the output.
- Run `docker run -d -p 8080:80 nginx` to start a default Nginx container.
- Run `docker ps` to show the running Nginx container and note its CONTAINER ID.
- Open your browser and load http://localhost:8080 to display the default Nginx welcome page.
- Stop the Nginx container using `docker stop <CONTAINER ID>`.
- Run `docker run -d -p 8080:80 -v $(pwd)/index.html:/usr/share/nginx/html/index.html nginx` to start an Nginx container serving your custom HTML.
- Run `docker ps` to show the running Nginx container and note its CONTAINER ID.
- Load http://localhost:8080 in your browser to view your custom page.
- Stop the Nginx container using `docker stop <CONTAINER ID>`.

*We recommend using Canvas Studio to record your video*

## Reflection Question

**In your own words (3–5 sentences):**  

What does the `-v` flag do when running the container? Why might mounting files from your host machine into a container be useful when developing a scalable web application?

## Submission Instructions

Submit the following to Canvas:

- The 1-minute video as described above.
- Your answer to the reflection question.