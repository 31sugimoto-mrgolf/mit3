document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('registerForm');
  const message = document.getElementById('message');
  const submitButton = document.getElementById('submitButton');
  const nameInput = document.getElementById('name');

  let lineUserId = '';
  let displayName = '';

  try {
    const profile = await initLiff();

    if (!profile) {
      message.textContent = 'LINEログインが必要です。';
      return;
    }

    lineUserId = profile.userId;
    displayName = profile.displayName || '';

    // URLパラメータから displayName が来ていれば優先
    const params = new URLSearchParams(window.location.search);
    const displayNameFromQuery = params.get('displayName');

    if (displayNameFromQuery) {
      displayName = displayNameFromQuery;
    }

    if (displayName && !nameInput.value) {
      nameInput.value = displayName;
    }

  } catch (error) {
    console.error(error);
    message.textContent = '初期化に失敗しました。';
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    message.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = '登録中...';

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const birthday = document.getElementById('birthday').value;

    if (!name || !phone || !birthday) {
      message.textContent = 'すべての項目を入力してください。';
      submitButton.disabled = false;
      submitButton.textContent = '登録する';
      return;
    }

    try {
      const result = await registerMember({
        lineUserId,
        name,
        phone,
        birthday
      });

      if (!result.ok) {
        console.error(result);
        message.textContent = '登録に失敗しました。';
        submitButton.disabled = false;
        submitButton.textContent = '登録する';
        return;
      }

      message.textContent = '登録が完了しました。会員証画面へ移動します...';

      setTimeout(() => {
        window.location.href = 'member.html';
      }, 1000);

    } catch (error) {
      console.error(error);
      message.textContent = 'エラーが発生しました。';
      submitButton.disabled = false;
      submitButton.textContent = '登録する';
    }
  });
});