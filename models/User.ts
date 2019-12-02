const Sequelize = require("sequelize")
const {Model, DataTypes} = Sequelize

export default class UserModel extends Model {
  private _username!: string
  private _passwordHash!: string
}

const sequelize = new Sequelize("domeeni", "domeeni", "yYN@6hZCgyBJ1&PVpXld@", {
  host: "3.123.51.95",
  dialect: "mysql"
})

UserModel.init(
  {
    _username: {
      type: new DataTypes.STRING(),
      allowNull: false
    },
    _passwordHash: {
      type: new DataTypes.STRING(),
      allowNull: false
    }
  },
  {
    sequelize: sequelize,
    modelName: "user"
  }
)
