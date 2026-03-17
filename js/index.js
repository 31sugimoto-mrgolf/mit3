document.addEventListener('DOMContentLoaded', async () => {
  const statusText = document.getElementById('statusText');

  try {
    statusText.textContent = 'LINEログインを確認しています...';

    const profile = await initLiff();

    if (!profile) {
      statusText.textContent = 'LINEログイン画面へ移動します...';
      return;
    }

    const lineUserId = profile.userId;
    const displayName = profile.displayName || '';

    statusText.textContent = '会員情報を確認しています...';

    const result = await getMemberByLineId(lineUserId);

    if (!result.ok) {
      console.error('getMemberByLineId error:', result);
      statusText.textContent =
        '会員確認に失敗しました: ' + (result.error || 'unknown error');
      return;
    }

    if (result.exists && result.member) {
      statusText.textContent = '会員証画面へ移動します...';
      window.location.href = 'member.html';
      return;
    }

    statusText.textContent = '初回登録画面へ移動します...';

    const params = new URLSearchParams({
      lineUserId: lineUserId,
      displayName: displayName
    });

    window.location.href = `register.html?${params.toString()}`;
  } catch (error) {
    console.error('index.js fatal error:', error);
    statusText.textContent =
      'エラーが発生しました: ' + (error.message || JSON.stringify(error));
  }
});