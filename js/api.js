async function getMemberByLineId(lineUserId) {
  try {
    const url =
      `${APP_CONFIG.GAS_API_URL}?action=getMemberByLineId&lineUserId=${encodeURIComponent(lineUserId)}`;

    const response = await fetch(url, {
      method: 'GET'
    });

    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('getMemberByLineId failed:', error);
    return {
      ok: false,
      error: error.message || String(error)
    };
  }
}

async function getMemberDetailByLineId(lineUserId) {
  try {
    const url =
      `${APP_CONFIG.GAS_API_URL}?action=getMemberDetailByLineId&lineUserId=${encodeURIComponent(lineUserId)}`;

    const response = await fetch(url, {
      method: 'GET'
    });

    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('getMemberDetailByLineId failed:', error);
    return {
      ok: false,
      error: error.message || String(error)
    };
  }
}

async function postToGas(action, payload) {
  try {
    const response = await fetch(APP_CONFIG.GAS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action,
        payload
      })
    });

    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('postToGas failed:', error);
    return {
      ok: false,
      error: error.message || String(error)
    };
  }
}

async function registerMember(payload) {
  return await postToGas('registerMember', payload);
}

async function addVisit(payload) {
  return await postToGas('addVisit', payload);
}