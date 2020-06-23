function loadMenu(configuration) {
  const { menu } = configuration;

  return Object.keys(menu).map((k) => ({
    url: menu[k],
    title: k,
  }));
}

module.exports = loadMenu;
