# 🚀 How to Deploy to Vercel

There are two main ways to deploy this Next.js app to Vercel: using the **Vercel Dashboard** (recommended for continuous deployment) or using the **Vercel CLI** (from your terminal).

---

## Method 1: The Vercel Dashboard (Recommended)

This is the easiest and most automated method. Once set up, your app will automatically deploy every time you push to the `main` branch on GitHub.

1. **Push your code to GitHub** 
   Make sure all your latest changes are pushed to your GitHub repository.
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Log in to Vercel**
   Go to [vercel.com](https://vercel.com) and log in with your GitHub account.

3. **Import Project**
   - Click the **"Add New..."** button and select **"Project"**.
   - Under "Import Git Repository", find `budgeteasyv1` and click **Import**.

4. **Deploy**
   - Vercel automatically detects that it's a Next.js project. You don't need to change any build settings.
   - Click the **Deploy** button.
   - Wait a minute for the build to finish. Your app is now live!

*Bonus: From now on, any time you run `git push`, Vercel will automatically build and deploy the updates.*

---

## Method 2: The Vercel CLI (From your Terminal)

This is the method I just used. It's great if you want to deploy quickly without opening the browser.

1. **Install Vercel CLI & Log in**
   If it's your first time, you'll need to log in to the Vercel CLI:
   ```bash
   npx vercel login
   ```
   Follow the prompts to log in (usually via GitHub or email).

2. **Deploy a Preview Build (Optional)**
   If you want to test your site on a live temporary URL *before* pushing it to production:
   ```bash
   npx vercel
   ```

3. **Deploy to Production**
   To deploy the live, final version of your app:
   ```bash
   npx vercel --prod
   ```
   *Tip: You can add `--yes` to skip all the confirmation prompts: `npx vercel --prod --yes`*

---

## Custom Domains

Once your app is deployed, you'll get a `something.vercel.app` domain. To add your own custom domain (e.g., `budgeteasy.com`):
1. Go to your project on the Vercel Dashboard.
2. Click **Settings** > **Domains**.
3. Type in your custom domain and click **Add**.
4. Vercel will give you the DNS records (like an A Record or CNAME) to add to your domain provider (e.g., GoDaddy, Namecheap, Route53).
