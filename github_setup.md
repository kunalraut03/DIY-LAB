# Getting Your Website on GitHub

## 1. Create a GitHub Account
If you don't already have a GitHub account, go to [github.com](https://github.com) and sign up for a free account.

## 2. Create a New Repository
1. Log in to GitHub
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "my-website")
4. Add an optional description
5. Choose public or private visibility
6. Don't initialize with a README, .gitignore, or license for now
7. Click "Create repository"

## 3. Set Up Git Locally

Open a terminal or command prompt and navigate to your website directory:

```bash
cd c:\Users\kaymh\Downloads\new_website
```

Initialize Git in your local project:

```bash
git init
```

## 4. Connect Local Repository to GitHub

GitHub will show you commands after creating the repository. Run these commands in your terminal:

```bash
git remote add origin https://github.com/YOUR-USERNAME/your-repository-name.git
```

Replace YOUR-USERNAME and your-repository-name with your actual GitHub username and the name you chose for your repository.

## 5. Add and Commit Your Files

Add all your files to Git:

```bash
git add .
```

Commit your files:

```bash
git commit -m "Initial commit"
```

## 6. Push to GitHub

Push your files to GitHub:

```bash
git push -u origin main
```

Note: If you're using an older version of Git, you might need to use `master` instead of `main`:

```bash
git push -u origin master
```

## 7. Verify

Go to your GitHub repository URL (https://github.com/YOUR-USERNAME/your-repository-name) to see your uploaded website files.
