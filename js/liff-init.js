async function initLiff() {
  try {
    await liff.init({ liffId: APP_CONFIG.LIFF_ID });

    if (!liff.isLoggedIn()) {
      liff.login();
      return null;
    }

    const profile = await liff.getProfile();
    return profile;
  } catch (error) {
    console.error('LIFF initialization failed:', error);
    throw error;
  }
}