document.addEventListener('DOMContentLoaded', async () => {
  const message = document.getElementById('message');
  const memberCard = document.getElementById('memberCard');
  const visitButton = document.getElementById('visitButton');
  const reloadButton = document.getElementById('reloadButton');

  let lineUserId = '';

  async function loadMemberData() {
    message.textContent = '会員情報を読み込み中です...';

    try {
      const result = await getMemberDetailByLineId(lineUserId);

      if (!result.ok) {
        message.textContent = '会員情報の取得に失敗しました: ' + (result.error || '');
        return;
      }

      if (!result.exists || !result.member) {
        message.textContent = '会員情報が見つかりません。';
        return;
      }

      const member = result.member;

      document.getElementById('memberNo').textContent = member.memberNo || '-';
      document.getElementById('memberName').textContent = member.name || '-';
      document.getElementById('memberStatus').textContent = member.status || '-';
      document.getElementById('memberRank').textContent = member.rank || '-';
      document.getElementById('visitCount').textContent = `${member.visitCount || 0}回`;
      document.getElementById('lastVisitAt').textContent = formatDate(member.lastVisitAt);

      memberCard.style.display = 'block';
      message.textContent = '';
    } catch (error) {
      console.error(error);
      message.textContent = '読み込み中にエラーが発生しました。';
    }
  }

  try {
    const profile = await initLiff();

    if (!profile) {
      message.textContent = 'LINEログインが必要です。';
      return;
    }

    lineUserId = profile.userId;

    await loadMemberData();

  } catch (error) {
    console.error(error);
    message.textContent = '初期化に失敗しました。';
    return;
  }

  visitButton.addEventListener('click', async () => {
    visitButton.disabled = true;
    visitButton.textContent = '記録中...';
    message.textContent = '来店を記録しています...';

    try {
      const result = await addVisit({
        lineUserId,
        method: 'app',
        note: ''
      });

      if (!result.ok) {
        message.textContent = '来店記録に失敗しました: ' + (result.error || '');
        visitButton.disabled = false;
        visitButton.textContent = '来店する';
        return;
      }

      message.textContent = '来店を記録しました。';
      await loadMemberData();

    } catch (error) {
      console.error(error);
      message.textContent = '来店記録中にエラーが発生しました。';
    }

    visitButton.disabled = false;
    visitButton.textContent = '来店する';
  });

  reloadButton.addEventListener('click', async () => {
    await loadMemberData();
  });
});

function formatDate(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return '-';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}