# Installation Guide

## Python

This repo uses `uv` to manage dependencies. Follow the `uv` installation guide [here](https://pypi.org/project/uv/) if you don't have it installed already. Next, make sure the correct version of python is installed:

```bash
uv python install 3.10
```

Then, create and activate your virtual environment:

```bash
uv venv --python 3.10
source .venv/bin/activate
```
