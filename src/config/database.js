module.exports = {
  dialect: 'postgres',
  host: '192.168.99.100',
  port: '5434',
  username: 'postgres',
  password: 'bootcamp',
  database: 'gympointDB',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
