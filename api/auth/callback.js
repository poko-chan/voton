// api/auth/callback.js
export default async function handler(req, res) {
  // GitHubから送られてくる ?code=xxxx を取得
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: '認証コード（code）が見つかりません' });
  }

  try {
    // 1. 認可コードをアクセストークンに交換する
    const tokenResponse = await fetch('https://github.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    // 2. アクセストークンを使ってGitHubからユーザー情報を取得
    const userResponse = await fetch('https://github.com', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
      },
    });
    const userData = await userResponse.json();

    // 💡 ここで userData.id や userData.email が取得できます！
    // 必要に応じて、Neonデータベースに保存したり、JWTを発行してクッキーに保存する処理をここに書きます。
    console.log("ログインしたユーザー:", userData.login);

    // 3. ログイン完了後、トップページ（/）へリダイレクト
    res.writeHead(302, { Location: '/' });
    res.end();

  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
}
