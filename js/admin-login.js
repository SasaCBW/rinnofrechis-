<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">

  <title>Admin | Rinno Frenchies</title>

  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./css/admin.css?v=20261010-1">
</head>

<body class="login-body">
  <main class="login-shell">

    <div class="login-image">
      <a href="./index.html">✿ RINNO Frenchies</a>
      <h1>Um cantinho especial para cuidar de tudo.</h1>
      <p>Painel exclusivo da Rinno Frenchies.</p>
    </div>

    <div class="login-panel">
      <form id="loginForm" class="login-card">
        <a href="./index.html">← Voltar ao site</a>

        <span class="eyebrow">ACESSO RESTRITO</span>
        <h2>Bem-vindo de volta ♡</h2>
        <p>Entre com a conta administrativa.</p>

        <label>
          E-mail
          <input
            id="email"
            type="email"
            autocomplete="username"
            required
          >
        </label>

        <label>
          Senha
          <input
            id="password"
            type="password"
            autocomplete="current-password"
            required
          >
        </label>

        <button class="btn" id="loginButton" type="submit">
          Entrar no painel ↗
        </button>

        <p id="loginMessage" role="status"></p>
      </form>
    </div>

  </main>

  <script type="module" src="./js/admin-login.js?v=20261010-1"></script>
</body>
</html>
