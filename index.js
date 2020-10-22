const express = require("express");
const app = express();
const cors = require("cors");
var admin = require("firebase-admin");
var bodyParser = require("body-parser");

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://letme-3320d.firebaseio.com",
});
// app.use(cors());
// app.options("*", cors());
const db = admin.firestore();
app.use(cors({ credentials: true, origin: true }));
app.options("*", cors({ credentials: true, origin: true }));
// app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);
const { Op } = require("sequelize");
function uuidv4() {
  return "xxxxxxyxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(20);
  });
}

const models = require("./models");
const e = require("express");

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

function fngenID() {
  var genid = uuidv4();
  const searchID = async () => {
    const data = await models.User.findOne({
      where: { ID_user: genid },
    });
    if (!data) {
      // console.log("com");
    } else {
      // console.log("fail");
      return fngenID();
    }
  };
  searchID();
  // console.log("return id");
  return genid;
}
app.post("/res", async (req, res) => {
  const itemResponse = req.body;
  const resEmail = itemResponse.email;
  const resFname = itemResponse.Fname;
  const resLname = itemResponse.Lname;
  const id = fngenID();
  console.log(id);
  console.log(resEmail);
  const check = await models.User.findOne({
    where: { Email: resEmail },
  });
  if (check) {
    const add = await models.User.update(
      { Firstname: resFname, Lastname: resLname },
      { where: { Email: resEmail } }
    );
    var message = "ตรวจพบข้อมูลซ้ำ";
    res.json({ message });
  } else {
    try {
      const add = await models.User.create({
        ID_user: id,
        Email: resEmail,
        Firstname: resFname,
        Lastname: resLname,
      });
      var message = "เสร็จสิ้น";
      res.json({ message });
    } catch (error) {
      var message = error;
      res.json({ message });
    }
  }

  req.setTimeout(0);
});

app.post("/login", async (req, res) => {
  const itemResponse = req.body;
  const resEmail = itemResponse.email;
  let massage = "";
  try {
    const data = await models.User.findOne({
      where: { Email: resEmail },
      logging: console.log,
    });
    console.log("ID_user-->");
    const ID_user = data.ID_user;
    console.log(ID_user);
    res.json({ ID_user, massage });
  } catch (error) {
    massage = "wrong email or password message ";
    res.json({ massage });
  }
});

function fngenID_Farm() {
  var genid = uuidv4();
  const searchID = async () => {
    const data = await models.Farm.findOne({
      where: { ID_Farm: genid },
    });
    if (!data) {
      console.log("com");
    } else {
      console.log("fail");
      return fngenID_Farm();
    }
  };
  searchID();
  console.log("return id");
  return genid;
}

app.post("/getNoMassage", async (req, res) => {
  const itemResponse = req.body;
  const Iduser = itemResponse.ID_user;
  const massage = await models.Massage.findAll({
    where: { ID_user: Iduser, Status: 0 },
  });
  res.json({ massage });
});

app.post("/myFarm", async (req, res) => {
  const itemResponse = req.body;
  const resFarmName = itemResponse.FarmName;
  const resLocation = itemResponse.Location;
  const resID_User = itemResponse.ID;

  const ID_Farm = fngenID_Farm();
  const add = await models.Farm.create({
    ID_User: resID_User,
    ID_Farm: ID_Farm,
    FarmName: resFarmName,
    Location: resLocation,
  });
});

app.post("/myFarm/update", async (req, res) => {
  const itemResponse = req.body;
  const resFarmName = itemResponse.toFarmName;
  const resLocation = itemResponse.toFarmLocation;
  const resID_Farm = itemResponse.toFarmID;
  console.log(resFarmName);
  console.log(resLocation);
  console.log(resID_Farm);
  await models.Farm.update(
    { FarmName: resFarmName, Location: resLocation },

    {
      where: {
        ID_Farm: resID_Farm,
      },
    }
  );
});
function fngenID_Project() {
  var genid = uuidv4();
  const searchID = async () => {
    const data = await models.Project.findOne({
      where: { ID_Project: genid },
    });
    if (!data) {
      console.log("com");
    } else {
      console.log("fail");
      return fngenID_Project();
    }
  };
  searchID();
  console.log("return id");
  return genid;
}
app.post("/createProject", async (req, res) => {
  const itemResponse = req.body;
  const resProjectName = itemResponse.projectName;
  const resProjectDescription = itemResponse.projectDescription;
  const resProjectID_User = itemResponse.ID_User;
  const Id_Project = fngenID_Project();
  const add = await models.Project.create({
    ID_Project: Id_Project,
    ProjectName: resProjectName,
    Description: resProjectDescription,
  });
  const add2 = await models.Project_User.create({
    ID_Project: Id_Project,
    ID_User: resProjectID_User,
    Status: "Owner",
  });
});
app.post("/myFarm/search", async (req, res) => {
  const itemResponse = req.body;
  const resID_User = itemResponse.ID_User;
  const search_ID_ProJect = await models.Farm.findAll({
    where: { ID_User: resID_User },
  });
  const data = search_ID_ProJect.map(item => {
    return item;
  });
  console.log(data);
  res.json({ data });
});

app.post("/myProject", async (req, res) => {
  const itemResponse = req.body;
  const resID_User = itemResponse.ID_User;
  const search_ID_ProJect = await models.Project_User.findAll({
    where: { ID_User: resID_User },
  });

  const data = await Promise.all(
    search_ID_ProJect.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Project;
      console.log(item2);
      const dataProject = await models.Project.findAll({
        where: { ID_Project: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });
      console.log(ar);
      return ar;
    })
  );
  console.log(data);
  res.json({ data });
});

app.post("/setting", async (req, res) => {
  const itemResponse = req.body;
  const resID_User = itemResponse.ID_User;
  const resID_Project = itemResponse.toProID;
  const search_status = await models.Project_User.findOne({
    where: { ID_User: resID_User, ID_Project: resID_Project },
  });
  var Status = {};
  Status = search_status.dataValues.Status;
  console.log("Test-Status");
  var Status2 = "";
  Status2 = String(Status);
  console.log(Status2);

  res.json({ Status2 });
});

app.post("/JoinProject", async (req, res) => {
  const itemResponse = req.body;
  const resCodeJoin = itemResponse.codeJoin;
  const resID_User = itemResponse.ID_User;

  const getEmail = await models.User.findOne({
    where: { ID_User: resID_User },
  });
  const email = getEmail.dataValues.Email;
  const check = await models.Project.findOne({
    where: { ID_Project: resCodeJoin },
  });
  console.log("check", check);

  let massage = "";
  if (check) {
    console.log("true");
    let ProName = check.dataValues.ProjectName;
    const ck = await models.Massage.findOne({
      where: { ID_user: resID_User, ID_Project: resCodeJoin },
    });
    if (ck) {
      massage = "ส่งคำขอแล้ว2";
      res.json({ massage });
    } else {
      const cl = await models.Project_User.findOne({
        where: { ID_user: resID_User, ID_Project: resCodeJoin },
      });
      if (cl) {
        massage = "ไม่สามารถเข้าร่วมได้";
        res.json({ massage });
      } else {
        const add = await models.Massage.create({
          ID_user: resID_User,
          Email: email,
          ID_Project: resCodeJoin,
          ProjectName: ProName,
          Status: 0,
          Massage: "คำขอเข้าร่วมโปรเจค",
        });
        massage = "ส่งคำขอแล้ว";
        res.json({ massage });
      }
    }
  } else if (!check) {
    console.log("false");
    massage = "ไม่พบโปรเจคนี้";
    res.json({ massage });
  }
});
app.post("/myProject/EditName", async (req, res) => {
  const itemResponse = req.body;
  const resName = itemResponse.editName;
  const resID_Pro = itemResponse.toProID;
  console.log(resName);
  console.log(resID_Pro);
  await models.Project.update(
    { ProjectName: resName },
    {
      where: {
        ID_Project: resID_Pro,
      },
    }
  );
});
app.post("/myProject/EditDescription", async (req, res) => {
  const itemResponse = req.body;

  const resDescription = itemResponse.editDescription;
  const resID_Pro = itemResponse.toProID;

  console.log(resDescription);
  console.log(resID_Pro);
  await models.Project.update(
    { Description: resDescription },
    {
      where: {
        ID_Project: resID_Pro,
      },
    }
  );
});
app.post("/myProject/Add", async (req, res) => {
  const itemResponse = req.body;
  const resEmail = itemResponse.addEmail;
  const resProID = itemResponse.toProID;
  const resProName = itemResponse.proName;

  var Massage = " ";
  try {
    const ckEmail = await models.User.findOne({
      where: { Email: resEmail },
      logging: console.log,
    });
    if (ckEmail) {
      var id_user = ckEmail.dataValues.ID_user;

      const search = await models.Project_User.findOne({
        where: { ID_user: id_user, ID_Project: resProID },
        logging: console.log,
      });

      if (search == null) {
        // const add = await models.Project_User.create({
        //   ID_Project: resProID,
        //   ID_User: id_user,
        //   Status: "Member",
        // });
        const add = await models.Massage.create({
          ID_user: id_user,
          Email: resEmail,
          ID_Project: resProID,
          ProjectName: resProName,
          Status: 0,
          Massage: "คำเชิญเข้าร่วมโปรเจค",
        });
        Massage = "ส่งคำเชิญ เข้าร่วมโปรเจคแล้ว กรุณารอการตอบกลับ";
      } else if (search != null) {
        Massage = " ผู้ใช้คนนี้เป็นสมาชิกของโปรเจค นี้แล้ว";
      }
    } else {
      Massage = "ไม่พบ email นี้ กรุณาระบุ email ให้ถูกต้อง";
    }
  } catch (error) {
    console.log(error);
  }

  console.log(Massage);
  // var Status_AddMember = "";
  // const data = await models.User.findOne({
  //   where: { Email: resEmail },
  //   logging: console.log,
  // });
  //
  // เช็คว่าซ้ำไหม
  // const search = await models.Project_User.findOne({
  //   where: { ID_user: id_user, ID_Project: resProID },
  //   logging: console.log,
  // });
  // if (search == null) {
  //   const add = await models.Project_User.create({
  //     ID_Project: resProID,
  //     ID_User: id_user,
  //     Status: "Member",
  //   });
  //   Status_AddMember = "Success Add Member";
  // } else if (search != null) {
  //   Status_AddMember = " Already a member of this project";
  // }
  res.json({ Massage });
});

app.post("/getManage", async (req, res) => {
  const itemResponse = req.body;
  const resProID = itemResponse.ID_Pro;
  const resUserID = itemResponse.ID_user;
  const dataOwner_ = await models.Project_User.findAll({
    where: { ID_Project: resProID, Status: "Owner" },
    logging: console.log,
  });
  const dataMember_ = await models.Project_User.findAll({
    where: { ID_Project: resProID, Status: "Member" },
    logging: console.log,
  });
  const dataTa_ = await models.Project_User.findAll({
    where: { ID_Project: resProID, Status: "Ta" },
    logging: console.log,
  });
  const dataStatus = await models.Project_User.findOne({
    where: { ID_Project: resProID, ID_User: resUserID },
    logging: console.log,
  });
  const dataOwner = await Promise.all(
    dataOwner_.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_User;
      console.log(item2);
      const UserOwner = await models.User.findAll({
        where: { ID_User: item2 },
      });
      const result = UserOwner.map(test => {
        ar = test.dataValues;
      });
      return ar;
    })
  );
  const dataMember = await Promise.all(
    dataMember_.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_User;
      console.log(item2);
      const UserOwner = await models.User.findAll({
        where: { ID_User: item2 },
      });
      const result = UserOwner.map(test => {
        ar = test.dataValues;
      });

      return ar;
    })
  );

  const dataTa = await Promise.all(
    dataTa_.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_User;
      console.log(item2);
      const UserOwner = await models.User.findAll({
        where: { ID_User: item2 },
      });
      const result = UserOwner.map(test => {
        ar = test.dataValues;
      });

      return ar;
    })
  );
  const Status = dataStatus.Status;
  const data = await models.Project.findOne({
    where: { ID_Project: resProID },
    logging: console.log,
  });
  const mas = await models.Massage.findOne({
    where: { ID_Project: resProID, Status: 0 },
    logging: console.log,
  });

  var massage = "";
  if (mas) {
    const MassageManage = await models.Massage.findAll({
      where: { ID_Project: resProID, Status: 0 },
      logging: console.log,
    });
    console.log(MassageManage);
    massage = "มีข้อมูล";
    res.json({
      dataOwner,
      dataMember,
      Status,
      dataTa,
      data,
      MassageManage,
      massage,
    });
  } else {
    MassageManage = "";
    massage = "ไม่มีข้อมูล";
    res.json({
      dataOwner,
      dataMember,
      Status,
      dataTa,
      data,
      MassageManage,
      massage,
    });
  }
});

app.post("/cancelAddMember", async (req, res) => {
  const itemResponse = req.body;
  const Iduser = itemResponse.idUser;
  const resID_Pro = itemResponse.idPro;
  await models.Massage.destroy({
    where: { ID_Project: resID_Pro, ID_user: Iduser },
  });
});
app.post("/acceptMember", async (req, res) => {
  const itemResponse = req.body;
  const Iduser = itemResponse.idUser;
  const resID_Pro = itemResponse.idPro;
  await models.Massage.update(
    { Status: 1, Massage: "" },
    {
      where: {
        ID_Project: resID_Pro,
        ID_User: Iduser,
      },
    }
  );

  const add = await models.Project_User.create({
    ID_Project: resID_Pro,
    ID_User: Iduser,
    Status: "Member",
  });
});
app.post("/getMassage", async (req, res) => {
  const itemResponse = req.body;
  const Iduser = itemResponse.idUser;

  const massage = await models.Massage.findAll({
    where: { ID_user: Iduser, Status: 0 },
  });
  res.json({ massage });
});

app.post("/getManage/setStatus", async (req, res) => {
  const itemResponse = req.body;
  const Iduser = itemResponse.Memail;
  const resID_Pro = itemResponse.ID_Pro;

  await models.Project_User.update(
    { Status: "Ta" },

    {
      where: {
        ID_Project: resID_Pro,
        ID_User: Iduser,
      },
    }
  );
});
app.post("/getManage/changetomember", async (req, res) => {
  const itemResponse = req.body;
  const Iduser = itemResponse.Memail;
  const resID_Pro = itemResponse.ID_Pro;

  await models.Project_User.update(
    { Status: "Member" },

    {
      where: {
        ID_Project: resID_Pro,
        ID_User: Iduser,
      },
    }
  );
});
app.post("/getManage/delete", async (req, res) => {
  const itemResponse = req.body;
  const Iduser = itemResponse.Memail;
  const resID_Pro = itemResponse.ID_Pro;

  await models.Project_User.destroy({
    where: {
      ID_Project: resID_Pro,
      ID_User: Iduser,
    },
  });
});

app.post("/getDetailInProject", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resID_User = itemResponse.ID_user;
  const data = await models.Project.findOne({
    where: { ID_Project: resID_Pro },
    logging: console.log,
  });

  const search_status = await models.Project_User.findOne({
    where: { ID_User: resID_User, ID_Project: resID_Pro },
  });
  var Status = {};
  Status = search_status.dataValues.Status;

  var Status2 = "";
  Status2 = String(Status);
  const Farm = await models.Farm.findAll({
    where: { ID_User: resID_User },
  });
  const get = await models.Project_Farm.findAll({
    where: { ID_Project: resID_Pro },
  });
  const getFarmInFarm = await Promise.all(
    get.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Farm;
      console.log(item2);
      const dataProject = await models.Farm.findAll({
        where: { ID_Farm: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });
      console.log(ar);
      return ar;
    })
  );
  const getBreeder = await models.Variety.findAll({
    where: { ID_Project: resID_Pro },
  });
  res.json({ data, Status2, Farm, getFarmInFarm, getBreeder });
});

app.post("/deleteProject", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resID_User = itemResponse.ID_user;

  const destroy = await models.Project.destroy({
    where: { ID_Project: resID_Pro },
    logging: console.log,
  });
  const destroy2 = await models.Project_User.destroy({
    where: { ID_Project: resID_Pro },
    logging: console.log,
  });
});

app.post("/leaveProject", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resID_User = itemResponse.ID_user;

  const destroy = await models.Project_User.destroy({
    where: { ID_Project: resID_Pro, ID_User: resID_User },
    logging: console.log,
  });
});

app.post("/myProject/AddFarm", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resID_Farm = itemResponse.selec;
  // const farm = itemResponse.ID_Farm;
  var mes = "";
  resID_Farm.map(async data => {
    let farm = data.ID_Farm;
    console.log(farm);
    try {
      const ck = await models.Project_Farm.findOne({
        where: { ID_Farm: farm, ID_Project: resID_Pro },
      });
      if (ck) {
        console.log("5");
        mes = "ไม่สำเร็จ";
      } else {
        console.log("1");
        const add = await models.Project_Farm.create({
          ID_Farm: farm,
          ID_Project: resID_Pro,
        });

        mes = "สำเร็จ";
        console.log(688, mes);
        console.log(689, "สำเร็จ");
      }
      console.log(691, mes);
      res.json({ mes });
    } catch (error) {
      console.log(error);
    }
  });
  // const add = await models.Project_Farm.create({
  //   ID_Farm: farm,
  //   ID_Project: resID_Pro,
  // });
});

app.post("/deleteFarm", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resID_Farm = itemResponse.idFarm;
  let massage = "";
  const ck1 = await models.Selection_SST.findOne({
    where: { ID_Farm: resID_Farm, ID_Project: resID_Pro },
  });

  if (ck1) {
    console.log("1");
    massage = "ไม่สามารถลบได้";
  } else {
    const ck2 = await models.SST.findOne({
      where: { ID_Farm: resID_Farm, ID_Project: resID_Pro },
    });
    if (ck2) {
      console.log("2");
      massage = "ไม่สามารถลบได้";
    } else {
      const ck3 = await models.Stem_Plantation.findOne({
        where: { ID_Farm: resID_Farm, ID_Project: resID_Pro },
      });
      if (ck3) {
        console.log("3");
        massage = "ไม่สามารถลบได้";
      } else {
        const add = await models.Project_Farm.destroy({
          where: {
            ID_Farm: resID_Farm,
            ID_Project: resID_Pro,
          },
        });
        console.log("4");
        massage = "การลบเสร็จสิ้น";
      }
    }
  }
  res.json({ massage });
});

app.post("/deleteBreeder", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resID_Breeder = itemResponse.nameB;
  let massage = "";
  const ck1 = await models.Breeding.findOne({
    where: { ID_Father: resID_Breeder, ID_Project: resID_Pro },
  });

  if (ck1) {
    console.log("1");
    massage = "ไม่สามารถลบได้";
  } else {
    const ck2 = await models.Breeding.findOne({
      where: { ID_Mother: resID_Breeder, ID_Project: resID_Pro },
    });
    if (ck2) {
      console.log("2");
      massage = "ไม่สามารถลบได้";
    } else {
      const add = await models.Variety.destroy({
        where: {
          BreederName: resID_Breeder,
          ID_Project: resID_Pro,
        },
      });
      console.log("4");
      massage = "การลบเสร็จสิ้น";
    }
  }

  res.json({ massage });
});
function fngenID_Breeder() {
  var genid = uuidv4();
  const searchID = async () => {
    const data = await models.Veriety.findOne({
      where: { ID_Breeder: genid },
    });
    if (!data) {
      console.log("com");
    } else {
      console.log("fail");
      return fngenID_Project();
    }
  };
  searchID();
  console.log("return id");
  return genid;
}

app.post("/deleteBreeding", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.ProID;
  const resID_Breeding = itemResponse.id_Breeding;

  const delet = await models.Breeding.destroy({
    where: { ID_Project: resID_Project, ID_Breeding: resID_Breeding },
  });
});
app.post("/editBreeding", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.ProID;
  const resID_Breeding = itemResponse.id_Breeding;
  const resID_SelfNum = itemResponse.selfNum;
  const resID_Date = itemResponse.date;
  const resID_NFlow = itemResponse.nFlow;

  await models.Breeding.update(
    {
      Date_Breeding: resID_Date,
      Self_Round: resID_SelfNum,
      Flower_Num: resID_NFlow,
    },
    { where: { ID_Project: resID_Project, ID_Breeding: resID_Breeding } }
  );
});

app.post("/createBreeder", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.ID_Project;
  const resBreederName = itemResponse.BreederName;
  const IDBreeder = fngenID_Breeder();
  let massage = "";
  const check = await models.Variety.findOne({
    where: { BreederName: resBreederName, ID_Project: resID_Project },
  });
  if (check) {
    massage = "ตรวจพบชื่อ พันธุ์ ที่ซ้ำกัน";
  } else if (!check) {
    const data = await models.Variety.create({
      ID_Breeder: IDBreeder,
      ID_Project: resID_Project,
      BreederName: resBreederName,
    });
    massage = "success";
  }
  res.json({ massage });
});

app.post("/EditSetSeed", async (req, res) => {
  const itemResponse = req.body;
  const res_ID_Project = itemResponse.ProID;
  const res_ID_SetSeed = itemResponse.id_Seed;
  const res_num = itemResponse.numSeed2;
  const res_Date = itemResponse.dateSeed;
  const de = await models.Seed_Set.update(
    { Date_Seed: res_Date, Number_Seed: res_num },
    { where: { ID_Project: res_ID_Project, ID_Seed: res_ID_SetSeed } }
  );
  const ad = await models.AddSetSeed.update(
    { Date_Seed: res_Date, Number_Seed: res_num },
    { where: { ID_Project: res_ID_Project, ID_Seed: res_ID_SetSeed } }
  );
});
app.post("/deleteSetSeed", async (req, res) => {
  const itemResponse = req.body;
  const res_ID_Project = itemResponse.ProID;
  const res_ID_SetSeed = itemResponse.id_Seed;
  const de = await models.Seed_Set.destroy({
    where: { ID_Project: res_ID_Project, ID_Seed: res_ID_SetSeed },
  });
});
function fngenID_Add() {
  var genid = uuidv4();
  const searchID = async () => {
    const data = await models.AddSetSeed.findOne({
      where: { ID_Gen: genid },
    });
    if (!data) {
      console.log("com");
    } else {
      console.log("fail");
      return fngenID_Add();
    }
  };
  searchID();
  console.log("return id");
  return genid;
}
app.post("/createSetSeed", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const resID_Breeding = itemResponse.chooseID_Breed;
  const resNumSeed = itemResponse.numSeed;
  const resDateSeed = itemResponse.dateSeed;

  console.log("Check log ");
  var now = new Date().getFullYear() + 543;
  const getNo = await models.GenNumber.findOne({
    where: { ID_Project: resID_Project, StepBy: "SetSeed" },
  });
  console.log("Check");

  let b = fngenID_Add();
  if (getNo) {
    var yearNo = parseInt(getNo.dataValues.Year, 10);
    if (now > yearNo) {
      await models.GenNumber.update(
        { No: 0, Year: now },

        {
          where: {
            ID_Project: resID_Project,
            StepBy: "SetSeed",
          },
        }
      );
      var a = "setSeed_" + now + "_" + 0;
      const data = await models.Seed_Set.create({
        ID_Project: resID_Project,
        ID_Seed: a,
        ID_Breeding: resID_Breeding,
        Number_Seed: resNumSeed,
        Date_Seed: resDateSeed,
        ID_Gen: b,
        check: 0,
      });
      const add = await models.AddSetSeed.create({
        ID_Project: resID_Project,
        ID_Seed: a,
        Date: resDateSeed,
        Number_Seed: resNumSeed,
        ID_Gen: b,
        Check: 1,
      });
    } else {
      var No = parseInt(getNo.dataValues.No, 10);
      var NoNext = No + 1;
      await models.GenNumber.update(
        { No: NoNext },
        {
          where: {
            ID_Project: resID_Project,
            StepBy: "SetSeed",
          },
        }
      );
      var a = "setSeed_" + now + "_" + NoNext;
      const data = await models.Seed_Set.create({
        ID_Project: resID_Project,
        ID_Seed: a,
        ID_Breeding: resID_Breeding,
        Number_Seed: resNumSeed,
        Date_Seed: resDateSeed,
        ID_Gen: b,
        check: 0,
      });
      const add = await models.AddSetSeed.create({
        ID_Project: resID_Project,
        ID_Seed: a,
        Date: resDateSeed,
        Number_Seed: resNumSeed,
        ID_Gen: b,
        Check: 1,
      });
    }
  } else {
    console.log("Create");
    const createNo = await models.GenNumber.create({
      ID_Project: resID_Project,
      No: 1,
      Year: now,
      StepBy: "SetSeed",
    });
    var a = "setSeed_" + now + "_" + 1;
    const data = await models.Seed_Set.create({
      ID_Project: resID_Project,
      ID_Seed: a,
      ID_Breeding: resID_Breeding,
      Number_Seed: resNumSeed,
      Date_Seed: resDateSeed,
      ID_Gen: b,
      check: 0,
    });
    const add = await models.AddSetSeed.create({
      ID_Project: resID_Project,
      ID_Seed: a,
      Date: resDateSeed,
      Number_Seed: resNumSeed,
      ID_Gen: b,
      Check: 1,
    });
  }
  req.setTimeout(0);
});

app.post("/createSeedling", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.ID_Project;
  const resID_Seed = itemResponse.id_seed_set;
  const resnumSeedling = 0;
  const resNumSeed2 = itemResponse.seedNum;
  const resDateSeedling = itemResponse.dateSeedling;
  const resLoactionSeedling = itemResponse.location;
  const resNumSeed = parseInt(resNumSeed2, 10);
  console.log("Check log ");
  console.log("Check log ");
  console.log("Check log ");
  res.json({ mes: "success" });
  var now = new Date().getFullYear() + 543;
  const getNo = await models.GenNumber.findOne({
    where: { ID_Project: resID_Project, StepBy: "Seedling" },
  });
  console.log("Check");
  if (getNo) {
    var yearNo = parseInt(getNo.dataValues.Year, 10);
    if (now > yearNo) {
      await models.GenNumber.update(
        { No: 0, Year: now },
        {
          where: {
            ID_Project: resID_Project,
            StepBy: "Seedling",
          },
        }
      );
      var a = "Seedling" + now + "_" + 0;
      const data = await models.Seedling.create({
        ID_Project: resID_Project,
        ID_Seedling: a,
        ID_Seed: resID_Seed,
        Number_Seed: resNumSeed,
        Date_Seed: resDateSeedling,
        Location_Seedling: resLoactionSeedling,
        Grow_Number: resnumSeedling,
        NumtoSST: 0,
      });
    } else {
      var No = parseInt(getNo.dataValues.No, 10);
      var NoNext = No + 1;
      await models.GenNumber.update(
        { No: NoNext },
        {
          where: {
            ID_Project: resID_Project,
            StepBy: "Seedling",
          },
        }
      );
      var a = "Seedling" + now + "_" + NoNext;
      const data = await models.Seedling.create({
        ID_Project: resID_Project,
        ID_Seedling: a,
        ID_Seed: resID_Seed,
        Number_Seed: resNumSeed,
        Date_Seed: resDateSeedling,
        Location_Seedling: resLoactionSeedling,
        Grow_Number: resnumSeedling,
        NumtoSST: 0,
      });
    }
  } else {
    console.log("Create");
    const createNo = await models.GenNumber.create({
      ID_Project: resID_Project,
      No: 1,
      Year: now,
      StepBy: "Seedling",
    });
    var a = "Seedling" + now + "_" + 1;
    const data = await models.Seedling.create({
      ID_Project: resID_Project,
      ID_Seedling: a,
      ID_Seed: resID_Seed,
      Number_Seed: resNumSeed,
      Date_Seed: resDateSeedling,
      Location_Seedling: resLoactionSeedling,
      Grow_Number: resnumSeedling,
      NumtoSST: 0,
    });
  }
});
app.post("/deleteSeedling", async (req, res) => {
  const itemResponse = req.body;
  const res_ID_Project = itemResponse.ProID;
  const res_ID_Seedling = itemResponse.idSeedling;
  const de = await models.Seedling.destroy({
    where: { ID_Project: res_ID_Project, ID_Seedling: res_ID_Seedling },
  });
});

app.post("/addGrowNumSeedling", async (req, res) => {
  const itemResponse = req.body;
  const res_ID_Project = itemResponse.ProID;
  const res_ID_Seedling = itemResponse.idSeedling;
  const res_Num = itemResponse.growNumX;
  console.log("res_Num");
  console.log(res_Num);
  const de = await models.Seedling.update(
    { Grow_Number: res_Num, NumtoSST: 0 },
    { where: { ID_Project: res_ID_Project, ID_Seedling: res_ID_Seedling } }
  );
});
app.post("/EditSeedling", async (req, res) => {
  const itemResponse = req.body;
  const res_ID_Project = itemResponse.ProID;
  const res_ID_Seedling = itemResponse.idSeedling;
  const res_Num = itemResponse.numSeed2;
  const res_Location = itemResponse.Location2;
  const res_Date = itemResponse.dateSeed;
  // const res_NumGrow = itemResponse.numGrow2;
  try {
    const de = await models.Seedling.update(
      {
        Date_Seed: res_Date,
        Number_Seed: res_Num,
        Location_Seedling: res_Location,
        // Grow_Number: res_NumGrow,
      },
      { where: { ID_Project: res_ID_Project, ID_Seedling: res_ID_Seedling } }
    );
    res.json({ mes: "แก้ไข ข้อมูลเสร็จสิ้น" });
  } catch (error) {
    res.json({ mes: "แก้ไข ผิดพลาด" });
  }
});

app.post("/addNumSeed", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.ProID;
  const res_ID_Seed = itemResponse.id_Seed;
  const res_NumSeed = itemResponse.addNewNumSeed;
  const res_Date = itemResponse.addNewDate;
  const res_ID = itemResponse.id_Gen;
  const add = await models.AddSetSeed.create({
    ID_Project: resID_Project,
    ID_Seed: res_ID_Seed,
    Date: res_Date,
    Number_Seed: res_NumSeed,
    ID_Gen: res_ID,
    Check: "",
  });
  const n = await models.Seed_Set.findOne({
    where: { ID_Project: resID_Project, ID_Seed: res_ID_Seed },
  });

  var result = n.dataValues.Number_Seed;
  var s = parseInt(res_NumSeed, 10);
  result = parseInt(result, 10);
  result = s + result;

  await models.Seed_Set.update(
    { Number_Seed: result, check: 1 },
    {
      where: {
        ID_Project: resID_Project,
        ID_Seed: res_ID_Seed,
      },
    }
  );
});
app.post("/getSeedling", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Seedling.findAll({
    where: { ID_Project: resID_Project },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);

  const dataSeedling = await models.Seedling.findAll({
    where: { ID_Project: resID_Project },
    limit: pageSize,
    offset: off,
  });
  const dataSeedSet = await models.Seed_Set.findAll({
    where: { ID_Project: resID_Project },
  });
  res.json({ dataSeedling, maxSize, dataSeedSet, num });
});

app.post("/getFarminProject", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.ProID;

  const dataFarminProject = await models.Project_Farm.findAll({
    where: { ID_Project: resID_Pro },
    logging: console.log,
  });
  const getFarmInFarm = await Promise.all(
    dataFarminProject.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Farm;
      console.log(item2);
      const dataProject = await models.Farm.findAll({
        where: { ID_Farm: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });
      console.log(ar);
      return ar;
    })
  );

  const getVarieties = await models.Variety.findAll({
    where: { ID_Project: resID_Pro },
    logging: console.log,
  });
  console.log(getVarieties);

  res.json({ getVarieties, getFarmInFarm });
});
app.post("/AddBreeding", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.ProID;
  const resFBreeder = itemResponse.FBreeder;
  const resMBreeder = itemResponse.MBreeder;
  const resChooseFarm = itemResponse.chooseFarm;
  const resBreedingDate = itemResponse.BreedingDate;
  const resBreedingType = itemResponse.BreedingType;
  const resSelfNum = itemResponse.selfNum;
  const resFlower = itemResponse.flower;
  var now = new Date().getFullYear() + 543;
  const getNo = await models.GenNumber.findOne({
    where: { ID_Project: resID_Pro, StepBy: "Breeding" },
  });
  console.log("Check");
  if (getNo) {
    var yearNo = parseInt(getNo.dataValues.Year, 10);
    if (now > yearNo) {
      await models.GenNumber.update(
        { No: 0, Year: now },

        {
          where: {
            ID_Project: resID_Pro,
            StepBy: "Breeding",
          },
        }
      );
      var a = now + "_" + 0;
      const data = await models.Breeding.create({
        ID_Project: resID_Pro,
        ID_Breeding: a,
        ID_Father: resFBreeder,
        ID_Mother: resMBreeder,
        Date_Breeding: resBreedingDate,
        ID_Farm: resChooseFarm,
        Type_Breeding: resBreedingType,
        Self_Round: resSelfNum,
        Flower_Num: resFlower,
      });
    } else {
      var No = parseInt(getNo.dataValues.No, 10);
      var NoNext = No + 1;
      await models.GenNumber.update(
        { No: NoNext },
        {
          where: {
            ID_Project: resID_Pro,
            StepBy: "Breeding",
          },
        }
      );
      var a = yearNo + "_" + NoNext;
      const data = await models.Breeding.create({
        ID_Project: resID_Pro,
        ID_Breeding: a,
        ID_Father: resFBreeder,
        ID_Mother: resMBreeder,
        Date_Breeding: resBreedingDate,
        ID_Farm: resChooseFarm,
        Type_Breeding: resBreedingType,
        Self_Round: resSelfNum,
        Flower_Num: resFlower,
      });
    }
  } else {
    console.log("Create");
    const createNo = await models.GenNumber.create({
      ID_Project: resID_Pro,
      No: 1,
      Year: now,
      StepBy: "Breeding",
    });
    var a = now + "_" + 1;
    const data = await models.Breeding.create({
      ID_Project: resID_Pro,
      ID_Breeding: a,
      ID_Father: resFBreeder,
      ID_Mother: resMBreeder,
      Date_Breeding: resBreedingDate,
      ID_Farm: resChooseFarm,
      Type_Breeding: resBreedingType,
      Self_Round: resSelfNum,
      Flower_Num: resFlower,
    });
  }
});

app.post("/getBreeding", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.ProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Breeding.findAll({
    where: { ID_Project: resID_Pro },
  });
  console.log("555");
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);

  const getBreeding = await models.Breeding.findAll({
    where: { ID_Project: resID_Pro },
    limit: pageSize,
    offset: off,
  });
  const dataSST = await models.SST.findAll({
    where: { ID_Project: resID_Pro },
  });
  res.json({ getBreeding, maxSize, num, dataSST });
});
app.post("/getSST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;

  const get2 = await models.Project_Farm.findAll({
    where: { ID_Project: resID_Pro },
  });
  const getFarmInProject = await Promise.all(
    get2.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Farm;
      console.log(item2);
      const dataProject = await models.Farm.findAll({
        where: { ID_Farm: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });

      return ar;
    })
  );

  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.SST.findAll({
    where: { ID_Project: resID_Pro },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);

  const getSST = await models.SST.findAll({
    where: { ID_Project: resID_Pro },
    limit: pageSize,
    offset: off,
  });
  const dataSeedling = await models.Seedling.findAll({
    where: { ID_Project: resID_Pro },
  });

  //  const block = await Promise.all(
  //   num.map(async (item) => {

  //       let ar = [];
  //       let ck = item.dataValues.ID_Block;
  //       if(ck===""){

  //       }else{
  //         ar.concat(...ck);
  //   let a = 0
  //  function x(){
  //    if(ar[a]!==ck){
  //     console.log(ar)
  //      return ar;
  //    }
  //    else{
  //      console.log(ar)
  //     ar.concat(ck);
  //      a++;
  //       return x();
  //    }
  //  }
  //  x()
  // }

  // function fngenID_Breeder() {
  //   var genid = uuidv4();
  //   const searchID = async () => {
  //     const data = await models.Veriety.findOne({
  //       where: { ID_Breeder: genid },
  //     });
  //     if (!data) {
  //       console.log("com");
  //     } else {
  //       console.log("fail");
  //       return fngenID_Project();
  //     }
  //   };
  //   searchID();
  //   console.log("return id");
  //   return genid;
  // }

  // const dataProject = await models.Farm.findAll({
  //   where: { ID_Farm: item2 },
  // });
  // const result = dataProject.map((test) => {
  //   if (test.dataValues == null) {
  //   } else {
  //     ar = test.dataValues;
  //   }
  // });

  //   return ar;
  // })
  // );
  // console.log(block)

  res.json({ getFarmInProject, getSST, maxSize, dataSeedling, num });
});
app.post("/SearchFarmSST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const res_Farm = itemResponse.farm;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.SST.findAll({
    [Op.and]: [{ ID_Project: resID_Pro }, { ID_Farm: res_Farm }],
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);

  const Farm = await models.SST.findAll({
    where: {
      [Op.and]: [{ ID_Project: resID_Pro }, { ID_Farm: res_Farm }],
    },
    limit: pageSize,
    offset: off,
  });

  res.json({ Farm, maxSize, num });
});

app.post("/SearchBlockSST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const res_Farm = itemResponse.sblock;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.SST.findAll({
    [Op.and]: [{ ID_Project: resID_Pro }, { ID_Block: res_Farm }],
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);

  const Farm = await models.SST.findAll({
    where: {
      [Op.and]: [{ ID_Project: resID_Pro }, { ID_Block: res_Farm }],
    },
    limit: pageSize,
    offset: off,
  });

  res.json({ Farm, maxSize, num });
});

app.post("/SearchPlotSST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const res_Farm = itemResponse.plot;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.SST.findAll({
    [Op.and]: [{ ID_Project: resID_Pro }, { ID_Unit: res_Farm }],
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);

  const Farm = await models.SST.findAll({
    where: {
      [Op.and]: [{ ID_Project: resID_Pro }, { ID_Unit: res_Farm }],
    },
    limit: pageSize,
    offset: off,
  });

  res.json({ Farm, maxSize, num });
});
app.post("/addToSST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.ProID;
  const res_Seedling = itemResponse.idSeedling;
  const res_NumSeedGrow = itemResponse.numTo;
  var n = parseInt(res_NumSeedGrow, 10);

  // const test = await models.SST.findOne({
  //   where: { ID_Seedling: res_Seedling, ID_Project: resID_Pro },
  // });
  // if (test) {
  //   console.log("test");
  // } else {
  const getID_B2 = await models.Seedling.findOne({
    where: { ID_Seedling: res_Seedling, ID_Project: resID_Pro },
  });
  const getID_B = await models.Seed_Set.findOne({
    where: {
      ID_Seed: getID_B2.dataValues.ID_Seed,
      ID_Project: resID_Pro,
    },
  });

  if (getID_B) {
    console.log("ID");
    const id = getID_B.dataValues.ID_Breeding;
    const get = await models.Breeding.findOne({
      where: { ID_Breeding: id, ID_Project: resID_Pro },
    });
    if (get) {
      console.log("MF");
      console.log(getID_B);
      const Mother = get.dataValues.ID_Mother;
      const Father = get.dataValues.ID_Father;
      const Type = get.dataValues.Type_Breeding;
      var num = getID_B2.dataValues.NumtoSST;
      var num = parseInt(num, 10);
      var numtoNew = n + num;
      await models.Seedling.update(
        { NumtoSST: numtoNew },
        { where: { ID_Seedling: res_Seedling, ID_Project: resID_Pro } }
      );
      var now = new Date().getFullYear() + 543;

      for (let i = 0; i < n; i++) {
        const getNo = await models.GenNumber.findOne({
          where: { ID_Project: resID_Pro, StepBy: "SST" },
        });
        if (getNo) {
          var yearNo = parseInt(getNo.dataValues.Year, 10);
          if (now > yearNo) {
            await models.GenNumber.update(
              { No: 1, Year: now },

              {
                where: {
                  ID_Project: resID_Pro,
                  StepBy: "SST",
                },
              }
            );
            var a = Type + "_" + id + "_" + 1;
            const get = await models.SST.create({
              ID_Project: resID_Pro,
              ID_SST: a,
              ID_Father: Father,
              ID_Mother: Mother,
              Status_SST: "รอด",
              ID_Farm: "",
              FarmName: "",
              ID_Block: "",
              ID_Unit: "",
              ID_Seedling: res_Seedling,
              DateSST: "",
            });
          } else {
            var No = parseInt(getNo.dataValues.No, 10);
            var NoNext = No + 1;
            await models.GenNumber.update(
              { No: NoNext },
              {
                where: {
                  ID_Project: resID_Pro,
                  StepBy: "SST",
                },
              }
            );

            var a = Type + "_" + id + "_" + NoNext;
            const get = await models.SST.create({
              ID_Project: resID_Pro,
              ID_SST: a,
              ID_Father: Father,
              ID_Mother: Mother,
              Status_SST: "รอด",
              ID_Farm: "",
              FarmName: "",
              ID_Block: "",
              ID_Unit: "",
              ID_Seedling: res_Seedling,
              DateSST: "",
            });
          }
        } else {
          console.log("Create");
          const createNo = await models.GenNumber.create({
            ID_Project: resID_Pro,
            No: 1,
            Year: now,
            StepBy: "SST",
          });
          var a = Type + "_" + id + "_" + 1;
          const get = await models.SST.create({
            ID_Project: resID_Pro,
            ID_SST: a,
            ID_Father: Father,
            ID_Mother: Mother,
            Status_SST: "รอด",
            ID_Farm: "",
            FarmName: "",
            ID_Block: "",
            ID_Unit: "",
            ID_Seedling: res_Seedling,
            DateSST: "",
          });
        }
      }
    }
  } else {
  }
  // }

  // const toSST = await models.Seedling.findOne({
  //   where: { ID_Project: resID_Pro, ID_Seedling: res_Seedling },
  // });
  res.json({});
});
app.post("/createSST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resID_Seedling = itemResponse.idSeedling;
  const resStatus = itemResponse.status;
  const resToFarm = itemResponse.toFarm;
  const resToBlock = itemResponse.toBlock;
  const resToUnit = itemResponse.toUnit;
  const resDate_SST = itemResponse.dateSST;
  const getID_B = await models.Seedling.findOne({
    where: { ID_Seedling: resID_Seedling },
  });
  console.log("ID");
  const id = getID_B.dataValues.ID_Breeding;
  const get = await models.Breeding.findOne({
    where: { ID_Breeding: id },
  });
  console.log("MF");
  const Mother = get.dataValues.ID_Mother;
  const Father = get.dataValues.ID_Father;
  const Type = get.dataValues.Type_Breeding;
  console.log(Type);
  const farmName = await models.Farm.findOne({
    where: { ID_Farm: resToFarm },
  });
  const name = farmName.dataValues.FarmName;
  var now = new Date().getFullYear() + 543;
  const getNo = await models.GenNumber.findOne({
    where: { ID_Project: resID_Pro, StepBy: "SST" },
  });
  console.log("Check");
  if (getNo) {
    var yearNo = parseInt(getNo.dataValues.Year, 10);
    if (now > yearNo) {
      await models.GenNumber.update(
        { No: 1, Year: now },

        {
          where: {
            ID_Project: resID_Pro,
            StepBy: "SST",
          },
        }
      );
      var a = Type + "_" + id + "_" + 1;
      const get = await models.SST.create({
        ID_Project: resID_Pro,
        ID_SST: a,
        ID_Father: Father,
        ID_Mother: Mother,
        Status_SST: resStatus,
        ID_Farm: resToFarm,
        FarmName: name,
        ID_Block: resToBlock,
        ID_Unit: resToUnit,
        ID_Seedling: resID_Seedling,
        DateSST: resDate_SST,
      });
    } else {
      var No = parseInt(getNo.dataValues.No, 10);
      var NoNext = No + 1;
      await models.GenNumber.update(
        { No: NoNext },
        {
          where: {
            ID_Project: resID_Pro,
            StepBy: "SST",
          },
        }
      );

      var a = Type + "_" + id + "_" + NoNext;
      const get = await models.SST.create({
        ID_Project: resID_Pro,
        ID_SST: a,
        ID_Father: Father,
        ID_Mother: Mother,
        Status_SST: resStatus,
        ID_Farm: resToFarm,
        ID_Block: resToBlock,
        ID_Unit: resToUnit,
        FarmName: name,
        ID_Seedling: resID_Seedling,
        DateSST: resDate_SST,
      });
    }
  } else {
    console.log("Create");
    const createNo = await models.GenNumber.create({
      ID_Project: resID_Pro,
      No: 1,
      Year: now,
      StepBy: "SST",
    });
    var a = Type + "_" + id + "_" + 1;
    const get = await models.SST.create({
      ID_Project: resID_Pro,
      ID_SST: a,
      ID_Father: Father,
      ID_Mother: Mother,
      Status_SST: resStatus,
      ID_Farm: resToFarm,
      ID_Block: resToBlock,
      FarmName: name,
      ID_Unit: resToUnit,
      ID_Seedling: resID_Seedling,
      DateSST: resDate_SST,
    });
  }
});
app.post("/deleteSST", async (req, res) => {
  const itemResponse = req.body;
  const res_ID_Project = itemResponse.ProID;
  const res_ID_SST = itemResponse.idSST;
  const de = await models.SST.destroy({
    where: { ID_Project: res_ID_Project, ID_SST: res_ID_SST },
  });
});

app.post("/AddGroupSST", async (req, res) => {
  const itemResponse = req.body;
  const res_ID_Project = itemResponse.ProID;
  var res_ID_SST = [];
  res_ID_SST = itemResponse.selec;
  const res_Status = itemResponse.status2;
  const res_Date = itemResponse.date;
  const res_Farm = itemResponse.farm;
  const res_Block = itemResponse.block;
  const res_Plot = itemResponse.plot;
  const farmName = await models.Farm.findOne({
    where: { ID_Farm: res_Farm },
  });
  var farm = farmName.dataValues.FarmName;
  res_ID_SST.map(async item => {
    console.log(item.ID_SST);
    const de = await models.SST.update(
      {
        DateSST: res_Date,
        Status_SST: res_Status,
        ID_Farm: res_Farm,
        ID_Block: res_Block,
        ID_Unit: res_Plot,
        FarmName: farm,
      },
      { where: { ID_Project: res_ID_Project, ID_SST: item.ID_SST } }
    );
  });
});
app.post("/EditSST", async (req, res) => {
  const itemResponse = req.body;
  const res_ID_Project = itemResponse.ProID;
  const res_ID_SST = itemResponse.idSST;
  const res_Status = itemResponse.status2;
  const res_Date = itemResponse.date2;
  const res_Farm = itemResponse.farm;
  const res_Block = itemResponse.block;
  const res_Plot = itemResponse.plot;
  const farmName = await models.Farm.findOne({
    where: { ID_Farm: res_Farm },
  });
  var farm = farmName.dataValues.FarmName;
  const de = await models.SST.update(
    {
      DateSST: res_Date,
      Status_SST: res_Status,
      ID_Farm: res_Farm,
      ID_Block: res_Block,
      ID_Unit: res_Plot,
      FarmName: farm,
    },
    { where: { ID_Project: res_ID_Project, ID_SST: res_ID_SST } }
  );
});

function fngenID_Grow() {
  var genid = uuidv4();
  const searchID = async () => {
    const data = await models.Grow.findOne({
      where: { ID_Grow: genid },
    });
    if (!data) {
      console.log("com");
    } else {
      console.log("fail");
      return fngenID_Grow();
    }
  };
  searchID();
  console.log("return id");
  return genid;
}

app.post("/createSSTGrow", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.ID_Project;
  const resID_SST = itemResponse.id;
  const resDate = itemResponse.date;
  const resGerminate = itemResponse.germinate;
  const resGrow = itemResponse.grow;
  const resArea = itemResponse.area;
  const resDisease = itemResponse.disease;
  const resInsect = itemResponse.insect;
  const resProduct2 = itemResponse.product;
  var resProduct = parseInt(resProduct2, 10);

  const id = fngenID_Grow();
  const createGrow = await models.Grow.create({
    ID_Grow: id,
    ID_Project: resID_Pro,
    ID_Before: resID_SST,
    Date: resDate,
    Germinate: resGerminate,
    Grow: resGrow,
    Area: resArea,
    Disease: resDisease,
    Product: resProduct,
    Insect: resInsect,
  });
});
app.post("/editGrowSST", async (req, res) => {
  const itemResponse = req.body;
  // const resID_Pro = itemResponse.;
  const resID_Grow = itemResponse.idGrow;
  const resDate = itemResponse.Date2;
  const resGerminate = itemResponse.Germinate2;
  const resGrow = itemResponse.Grow2;
  const resArea = itemResponse.Area2;
  const resDisease = itemResponse.Disease2;
  const resInsect = itemResponse.Insect2;
  const resProduct = itemResponse.Product2;
  const de = await models.Grow.update(
    {
      Date: resDate,
      Germinate: resGerminate,
      Grow: resGrow,
      Area: resArea,
      Disease: resDisease,
      Product: resProduct,
      Insect: resInsect,
    },
    { where: { ID_Grow: resID_Grow } }
  );
});

app.post("/DeleteSSTGrow", async (req, res) => {
  const itemResponse = req.body;

  const res_ID = itemResponse.idGrow;
  console.log(res_ID);
  const de = await models.Grow.destroy({
    where: { ID_Grow: res_ID },
  });
});
app.post("/getSSTGrow", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;

  const off = (pageNumber - 1) * pageSize;
  const num = await models.SST.findAll({
    where: { ID_Project: resID_Project },
  });
  var maxSize = num.length / pageSize;

  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  const dataSST = await models.SST.findAll({
    where: { ID_Project: resID_Project },
    limit: pageSize,
    offset: off,
  });

  res.json({ dataSST, maxSize, num });
});

app.post("/getHomeFarm", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resID_User = itemResponse.ID_user;
  const Farm = await models.Farm.findAll({
    where: { ID_User: resID_User },
  });
  const get = await models.Project_Farm.findAll({
    where: { ID_Project: resID_Pro },
  });
  const getFarmInFarm = await Promise.all(
    get.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Farm;
      console.log(item2);
      const dataProject = await models.Farm.findAll({
        where: { ID_Farm: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });
      console.log(ar);
      return ar;
    })
  );

  res.json({ Farm, getFarmInFarm });
});

app.post("/getDetailFarm", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resID_User = itemResponse.ID_user;
  try {
    const data = await models.Project_Farm.findAll({
      where: { ID_Project: resID_Pro },
    });
    const getFarmInFarm = await Promise.all(
      data.map(async item => {
        let item2 = {};
        item2 = item.dataValues.ID_Farm;
        return item2;
      })
    );
    const gett = await models.Farm.findAll({
      where: { ID_User: resID_User, ID_Farm: { [Op.notIn]: getFarmInFarm } },
    });
    console.log(gett);

    const getFarmAddProject = await Promise.all(
      gett.map(async item => {
        let item2 = {};
        let ar = [];
        const xxxxx = [];
        item2 = item.dataValues.ID_Farm;
        console.log(item2);
        const dataProject = await models.Farm.findAll({
          where: { ID_Farm: item2 },
        });
        const result = dataProject.map(test => {
          let n = 0;
          if (test.dataValues == null) {
          } else {
            ar = test.dataValues;
            // checked = checked.concat({ no: n });
          }
        });
        console.log("xx", xxxxx);
        console.log(ar);
        return ar;
      })
    );

    const Farm = await Promise.all(
      data.map(async item => {
        let item2 = {};
        let ar = [];
        item2 = item.dataValues.ID_Farm;
        console.log(item2);
        const dataProject = await models.Farm.findAll({
          where: { ID_Farm: item2 },
        });
        const result = dataProject.map(test => {
          if (test.dataValues == null) {
          } else {
            ar = test.dataValues;
          }
        });
        console.log(ar);
        return ar;
      })
    );
    res.json({ getFarmAddProject, Farm });
  } catch (error) {}
  req.setTimeout(0);
});

app.post("/getBreeder", async (req, res) => {
  const itemResponse = req.body;
  const res_ID_Project = itemResponse.toProID;
  const Breeder = await models.Variety.findAll({
    where: { ID_Project: res_ID_Project },
  });
  console.log(Breeder);
  res.json({ Breeder });
});

app.post("/getDetailSeedNum", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const resID_Gen = itemResponse.id_Gen;
  const a = await models.AddSetSeed.findAll({
    where: { ID_Project: resID_Project, ID_Gen: resID_Gen },
  });
  res.json({
    a,
  });
});
app.post("/getSeed", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Seed_Set.findAll({
    where: { ID_Project: resID_Project },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  console.log(maxSize);
  const dataSeed = await models.Seed_Set.findAll({
    where: { ID_Project: resID_Project },
    limit: pageSize,
    offset: off,
  });
  const search = await models.Breeding.findAll({
    where: {
      ID_Project: resID_Project,
    },
  });
  res.json({ dataSeed, search, maxSize, num });
});
app.post("/getGrowSST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const resID_SST = itemResponse.id;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Grow.findAll({
    where: { ID_Project: resID_Project, ID_Before: resID_SST },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  maxSize = Math.ceil(maxSize);
  const dataGrow = await models.Grow.findAll({
    where: { ID_Project: resID_Project, ID_Before: resID_SST },
    limit: pageSize,
    offset: off,
  });
  console.log(dataGrow);

  res.json({ dataGrow, maxSize });
});

app.post("/createSectionSST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.ID_Project;
  const resDate = itemResponse.date;
  const resID_SST = itemResponse.idSST;
  const resAmount = itemResponse.amount;
  const getFarm = await models.SST.findOne({
    where: { ID_SST: resID_SST },
  });
  const FarmName = getFarm.dataValues.FarmName;
  const ID_Farm = getFarm.dataValues.ID_Farm;
  const ID_Block = getFarm.dataValues.ID_Block;
  const ID_Unit = getFarm.dataValues.ID_Unit;

  var now = new Date().getFullYear() + 543;
  const getNo = await models.GenNumber.findOne({
    where: { ID_Project: resID_Pro, StepBy: "SST-Section" },
  });
  console.log("Check");
  if (getNo) {
    var yearNo = parseInt(getNo.dataValues.Year, 10);
    if (now > yearNo) {
      await models.GenNumber.update(
        { No: 1, Year: now },

        {
          where: {
            ID_Project: resID_Pro,
            StepBy: "SST-Section",
          },
        }
      );
      var a = "SST" + "_" + now + "_" + 1;
      const get = await models.Selection_SST.create({
        ID_Project: resID_Pro,
        ID_Selection: a,
        ID_SST: resID_SST,
        Date: resDate,
        Amount: resAmount,
        ID_Farm: ID_Farm,
        ID_Block: ID_Block,
        ID_Unit: ID_Unit,
        FarmName: FarmName,
      });
    } else {
      var No = parseInt(getNo.dataValues.No, 10);
      var NoNext = No + 1;
      await models.GenNumber.update(
        { No: NoNext },
        {
          where: {
            ID_Project: resID_Pro,
            StepBy: "SST-Section",
          },
        }
      );

      var a = "SST" + "_" + now + "_" + NoNext;
      const get = await models.Selection_SST.create({
        ID_Project: resID_Pro,
        ID_Selection: a,
        ID_SST: resID_SST,
        Date: resDate,
        Amount: resAmount,
        ID_Farm: ID_Farm,
        ID_Block: ID_Block,
        ID_Unit: ID_Unit,
        FarmName: FarmName,
      });
    }
  } else {
    console.log("Create");
    const createNo = await models.GenNumber.create({
      ID_Project: resID_Pro,
      No: 1,
      Year: now,
      StepBy: "SST-Section",
    });
    var a = "SST" + "_" + now + "_" + 1;
    const get = await models.Selection_SST.create({
      ID_Project: resID_Pro,
      ID_Selection: a,
      ID_SST: resID_SST,
      Date: resDate,
      Amount: resAmount,
      ID_Farm: ID_Farm,
      ID_Block: ID_Block,
      ID_Unit: ID_Unit,
      FarmName: FarmName,
    });
  }
});

app.post("/editSelectionSST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.ID_Project;
  const resID_Selection = itemResponse.ID_Selection;
  const resDate = itemResponse.newDate;
  const resAmount = itemResponse.newAmount;

  const de = await models.Selection_SST.update(
    {
      Date: resDate,
      Amount: resAmount,
    },
    { where: { ID_Project: resID_Pro, ID_Selection: resID_Selection } }
  );
});
app.post("/deleteSelectionSST", async (req, res) => {
  const itemResponse = req.body;

  const res_ID_Project = itemResponse.ID_Project;
  const res_ID_Selection = itemResponse.ID_Selection;

  const de = await models.Selection_SST.destroy({
    where: { ID_Project: res_ID_Project, ID_Selection: res_ID_Selection },
  });
});

app.post("/getSelectionSST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const dataFarminProject = await models.Project_Farm.findAll({
    where: { ID_Project: resID_Project },
    logging: console.log,
  });
  const getFarmInFarm = await Promise.all(
    dataFarminProject.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Farm;
      console.log(item2);
      const dataProject = await models.Farm.findAll({
        where: { ID_Farm: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });
      console.log(ar);
      return ar;
    })
  );

  console.log(2254, getFarmInFarm);
  const num = await models.Selection_SST.findAll({
    where: { ID_Project: resID_Project },
  });

  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);

  const dataSelection = await models.Selection_SST.findAll({
    where: { ID_Project: resID_Project },
    limit: pageSize,
    offset: off,
  });

  const dataSST = await models.SST.findAll({
    where: { ID_Project: resID_Project },
  });
  res.json({ dataSelection, maxSize, dataSST, getFarmInFarm });
});

app.post("/createCST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resPreviousTest = itemResponse.chooseID;
  const resDate = itemResponse.addDate;
  const resToFarm = itemResponse.addFarm;
  const resToBlock = itemResponse.addBlock;
  const resToUnit = itemResponse.addUnit;
  const res_RepID = itemResponse.addRepID;
  const res_Count = itemResponse.addCount;
  const res_ID = itemResponse.id;
  // const getidSproutPlanting = await models.Selection_SST.findOne({
  //   where: { ID_Selection: resPreviousTest, ID_Project: resID_Pro },
  // });
  // console.log(getidSproutPlanting.dataValues.ID_SST);

  // const idSproutPlanting = getidSproutPlanting.dataValues.ID_SST;

  const farmName = await models.Farm.findOne({
    where: { ID_Farm: resToFarm },
  });
  const res_Farmname = farmName.dataValues.FarmName;

  var now = new Date().getFullYear() + 543;
  const getNo = await models.GenNumber.findOne({
    where: { ID_Project: resID_Pro, StepBy: "CST" },
  });
  console.log("Check");
  if (getNo) {
    var yearNo = parseInt(getNo.dataValues.Year, 10);
    if (now > yearNo) {
      await models.GenNumber.update(
        { No: 1, Year: now },

        {
          where: {
            ID_Project: resID_Pro,
            StepBy: "CST",
          },
        }
      );
      var a = "CST" + "_" + now + "_" + 1;
      const get = await models.Stem_Plantation.create({
        ID_Project: resID_Pro,
        ID_Stem: a,
        Step: "CST",
        ID_Previous: res_ID,
        ID_SproutPlanting: resPreviousTest,
        Date: resDate,
        ID_Farm: resToFarm,
        FarmName: res_Farmname,
        ID_Block: resToBlock,
        ID_Unit: resToUnit,
        ID_Rep: res_RepID,
        Count: res_Count,
      });
    } else {
      var No = parseInt(getNo.dataValues.No, 10);
      var NoNext = No + 1;
      await models.GenNumber.update(
        { No: NoNext },
        {
          where: {
            ID_Project: resID_Pro,
            StepBy: "CST",
          },
        }
      );

      var a = "CST" + "_" + now + "_" + NoNext;
      const get = await models.Stem_Plantation.create({
        ID_Project: resID_Pro,
        ID_Stem: a,
        Step: "CST",
        ID_Previous: res_ID,
        ID_SproutPlanting: resPreviousTest,
        Date: resDate,
        ID_Farm: resToFarm,
        FarmName: res_Farmname,
        ID_Block: resToBlock,
        ID_Unit: resToUnit,
        ID_Rep: res_RepID,
        Count: res_Count,
      });
    }
  } else {
    console.log("Create");
    const createNo = await models.GenNumber.create({
      ID_Project: resID_Pro,
      No: 1,
      Year: now,
      StepBy: "CST",
    });
    var a = "CST" + "_" + now + "_" + 1;
    const get = await models.Stem_Plantation.create({
      ID_Project: resID_Pro,
      ID_Stem: a,
      Step: "CST",
      ID_Previous: res_ID,
      ID_SproutPlanting: resPreviousTest,
      Date: resDate,
      ID_Farm: resToFarm,
      FarmName: res_Farmname,
      ID_Block: resToBlock,
      ID_Unit: resToUnit,
      ID_Rep: res_RepID,
      Count: res_Count,
    });
  }
});

app.post("/editCST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.ID_Project;
  const resID_Stem = itemResponse.ID_Stem;
  const resDate = itemResponse.newDate;
  const resID_Rep = itemResponse.newID_Rep;
  const resCount = itemResponse.newCount;
  const de = await models.Stem_Plantation.update(
    {
      Date: resDate,
      ID_Rep: resID_Rep,
      Count: resCount,
    },
    { where: { ID_Project: resID_Pro, ID_Stem: resID_Stem } }
  );
});
app.post("/deleteCST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Stem = itemResponse.ID_Stem;
  const resID_Pro = itemResponse.ID_Project;

  await models.Stem_Plantation.destroy({
    where: {
      ID_Project: resID_Pro,
      ID_Stem: resID_Stem,
    },
  });
});
app.post("/getCST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "CST" },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  console.log(maxSize);
  const dataCST = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "CST" },
    limit: pageSize,
    offset: off,
  });
  const search = await models.Selection_SST.findAll({
    where: {
      ID_Project: resID_Project,
    },
  });
  const dataFarminProject = await models.Project_Farm.findAll({
    where: { ID_Project: resID_Project },
    logging: console.log,
  });

  const getFarmInFarm = await Promise.all(
    dataFarminProject.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Farm;
      console.log(item2);
      const dataProject = await models.Farm.findAll({
        where: { ID_Farm: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });
      console.log(ar);
      return ar;
    })
  );

  // res.json({ dataSeed, search, maxSize });
  res.json({ search, getFarmInFarm, maxSize, dataCST, num });
});
app.post("/getCSTGrow", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;

  const off = (pageNumber - 1) * pageSize;
  const num = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "CST" },
  });
  var maxSize = num.length / pageSize;

  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  const dataCST = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "CST" },
    limit: pageSize,
    offset: off,
  });

  res.json({ dataCST, maxSize, num });
});
app.post("/getGrowCST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const resID_CST = itemResponse.id;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Grow.findAll({
    where: { ID_Project: resID_Project, ID_Before: resID_CST },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  maxSize = Math.ceil(maxSize);
  const dataGrow = await models.Grow.findAll({
    where: { ID_Project: resID_Project, ID_Before: resID_CST },
    limit: pageSize,
    offset: off,
  });
  console.log(dataGrow);

  res.json({ dataGrow, maxSize });
});

app.post("/getSelectionCST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Selection.findAll({
    where: { ID_Project: resID_Project, Step: "CST" },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  const dataSelection = await models.Selection.findAll({
    where: { ID_Project: resID_Project, Step: "CST" },
    limit: pageSize,
    offset: off,
  });
  const dataCST = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "CST" },
  });
  const dataFarminProject = await models.Project_Farm.findAll({
    where: { ID_Project: resID_Project },
    logging: console.log,
  });

  const getFarmInFarm = await Promise.all(
    dataFarminProject.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Farm;
      console.log(item2);
      const dataProject = await models.Farm.findAll({
        where: { ID_Farm: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });
      console.log(ar);
      return ar;
    })
  );
  res.json({ dataSelection, maxSize, dataCST, getFarmInFarm });
});
app.post("/createSectionCST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.ID_Project;
  const resDate = itemResponse.date;
  const resID_CST = itemResponse.id;
  const resAmount = itemResponse.amount;
  console.log(resID_Pro, resDate, resID_CST, resAmount);
  const check = await models.Selection.findOne({
    where: { Step: "CST", ID_Main: resID_CST, ID_Project: resID_Pro },
  });
  var message = "";
  if (check) {
    message = "ตรวจพบ ข้อมูลซ้ำ";
  } else {
    const findID = await models.Stem_Plantation.findOne({
      where: { ID_Stem: resID_CST, ID_Project: resID_Pro, Step: "CST" },
    });
    const a = findID.dataValues.ID_SproutPlanting;
    const get = await models.Selection.create({
      Step: "CST",
      ID_Project: resID_Pro,
      ID_SproutPlanting: a,
      ID_Main: resID_CST,
      Date: resDate,
      Amount: resAmount,
    });
    message = "การเพิ่มข้อมูลเสร็จสิ้น";
  }
  console.log(message);

  res.json({ message });
});

app.post("/editSelectionCST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.ID_Project;
  const res_ID_Main = itemResponse.ID;
  const resDate = itemResponse.newDate;
  const resAmount = itemResponse.newAmount;

  const de = await models.Selection.update(
    {
      Date: resDate,
      Amount: resAmount,
    },
    { where: { ID_Project: resID_Pro, ID_Main: res_ID_Main } }
  );
});
app.post("/deleteSelectionCST", async (req, res) => {
  const itemResponse = req.body;
  const res_ID_Project = itemResponse.ID_Project;
  const res_ID_Main = itemResponse.ID;

  const de = await models.Selection.destroy({
    where: { ID_Project: res_ID_Project, ID_Main: res_ID_Main },
  });
});
app.post("/addToPST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resData = itemResponse.data;
  const res_ID = itemResponse.ID;

  const checkAdd = await models.Stem_Plantation.findOne({
    where: { ID_Project: resID_Pro, Step: "PST", ID_Previous: res_ID },
  });
  let message = "";
  if (checkAdd) {
    message = "ตรวจพบข้อมูลซ้ำ";
  } else {
    var now = new Date().getFullYear() + 543;
    const getNo1 = await models.GenNumber.findOne({
      where: { ID_Project: resID_Pro, StepBy: "SET_PST" },
    });
    var a = "";
    if (getNo1) {
      var yearNo = parseInt(getNo1.dataValues.Year, 10);
      if (now > yearNo) {
        await models.GenNumber.update(
          { No: 1, Year: now },

          {
            where: {
              ID_Project: resID_Pro,
              StepBy: "SET_PST",
            },
          }
        );
        a = "PST" + now + "_set" + 1;
      } else {
        var No = parseInt(getNo1.dataValues.No, 10);
        var NoNext = No + 1;
        await models.GenNumber.update(
          { No: NoNext },
          {
            where: {
              ID_Project: resID_Pro,
              StepBy: "SET_PST",
            },
          }
        );
        a = "PST" + now + "_set" + NoNext;
      }
    } else {
      const createNo = await models.GenNumber.create({
        ID_Project: resID_Pro,
        No: 1,
        Year: now,
        StepBy: "SET_PST",
      });
      a = "PST" + now + "_set" + 1;
    }
    const id_Set = a;
    for (let index = 0; index < resData.length; index++) {
      const id_Previous = resData[index].chooseID;
      var idFarm = resData[index].addFarm;
      const farmName = await models.Farm.findOne({
        where: { ID_Farm: idFarm },
      });
      const res_Farmname = farmName.dataValues.FarmName;
      console.log(res_Farmname);
      const getNo = await models.GenNumber.findOne({
        where: { ID_Project: resID_Pro, StepBy: "PST" },
      });
      const findSproutPlanting = await models.Selection.findOne({
        where: { ID_Project: resID_Pro, Step: "CST", ID_Main: res_ID },
      });

      const idSprout = findSproutPlanting.dataValues.ID_SproutPlanting;

      if (getNo) {
        var yearNo = parseInt(getNo.dataValues.Year, 10);
        if (now > yearNo) {
          await models.GenNumber.update(
            { No: 1, Year: now },
            {
              where: {
                ID_Project: resID_Pro,
                StepBy: "PST",
              },
            }
          );
          var a = "PST" + "_" + now + "_" + 1;
          const get = await models.Stem_Plantation.create({
            ID_Project: resID_Pro,
            ID_Stem: a,
            Step: "PST",
            ID_Previous: id_Previous,
            ID_SproutPlanting: idSprout,
            Date: resData[index].addDate,
            ID_Farm: resData[index].addFarm,
            FarmName: res_Farmname,
            ID_Block: resData[index].addBlock,
            ID_Unit: resData[index].addUnit,
            ID_Rep: resData[index].addRepID,
            Count: resData[index].addCount,
            ID_Set: id_Set,
            numSelec: 0,
            dateSelec: "",
          });
          const get2 = await models.Set_Group.create({
            ID_Project: resID_Pro,
            Step: "PST",
            ID_Stem: a,
            ID_SproutPlanting: idSprout,
            ID_Set: id_Set,
          });
        } else {
          var No = parseInt(getNo.dataValues.No, 10);
          var NoNext = No + 1;
          await models.GenNumber.update(
            { No: NoNext },
            {
              where: {
                ID_Project: resID_Pro,
                StepBy: "PST",
              },
            }
          );
          var a = "PST" + "_" + now + "_" + NoNext;
          const get = await models.Stem_Plantation.create({
            ID_Project: resID_Pro,
            ID_Stem: a,
            Step: "PST",
            ID_Previous: id_Previous,
            ID_SproutPlanting: idSprout,
            Date: resData[index].addDate,
            ID_Farm: resData[index].addFarm,
            FarmName: res_Farmname,
            ID_Block: resData[index].addBlock,
            ID_Unit: resData[index].addUnit,
            ID_Rep: resData[index].addRepID,
            Count: resData[index].addCount,
            ID_Set: id_Set,
            numSelec: 0,
            dateSelec: "",
          });
          const get2 = await models.Set_Group.create({
            ID_Project: resID_Pro,
            Step: "PST",
            ID_Stem: a,
            ID_SproutPlanting: idSprout,
            ID_Set: id_Set,
          });
        }
      } else {
        console.log("Create");
        const createNo = await models.GenNumber.create({
          ID_Project: resID_Pro,
          No: 1,
          Year: now,
          StepBy: "PST",
        });
        var a = "PST" + "_" + now + "_" + 1;
        const get = await models.Stem_Plantation.create({
          ID_Project: resID_Pro,
          ID_Stem: a,
          Step: "PST",
          ID_Previous: id_Previous,
          ID_SproutPlanting: idSprout,
          Date: resData[index].addDate,
          ID_Farm: resData[index].addFarm,
          FarmName: res_Farmname,
          ID_Block: resData[index].addBlock,
          ID_Unit: resData[index].addUnit,
          ID_Rep: resData[index].addRepID,
          Count: resData[index].addCount,
          ID_Set: id_Set,
          numSelec: 0,
          dateSelec: "",
        });
        const get2 = await models.Set_Group.create({
          ID_Project: resID_Pro,
          Step: "PST",
          ID_Stem: a,
          ID_SproutPlanting: idSprout,
          ID_Set: id_Set,
        });
      }
    }

    const findSproutPlanting = await models.Selection.findOne({
      where: { ID_Project: resID_Pro, Step: "CST", ID_Main: res_ID },
    });
    const idSprout = findSproutPlanting.dataValues.ID_SproutPlanting;
    const createSelectoionGroup = await models.Selection_Group.create({
      ID_Project: resID_Pro,
      Step: "PST",
      ID_SproutPlanting: idSprout,
      ID_Set: id_Set,
      ToTalAmout: 0,
      SumID: "",
    });
    const findAllPST = await models.Stem_Plantation.findAll({
      where: { ID_Project: resID_Pro, Step: "PST", ID_Set: id_Set },
    });
    for (let index = 0; index < findAllPST.length; index++) {
      const element = findAllPST[index].dataValues.ID_Stem;
      console.log(2816, element);
      const get = await models.Selection_Group.findOne({
        where: { ID_Project: resID_Pro, Step: "PST", ID_Set: id_Set },
      });
      let = SumID = "";
      if (get.dataValues.SumID === "") {
        SumID = element;
      } else {
        SumID = get.dataValues.SumID + " , " + element;
      }
      const upDate = await models.Selection_Group.update(
        { SumID: SumID },
        { where: { ID_Project: resID_Pro, Step: "PST", ID_Set: id_Set } }
      );
    }
    message = "การเพิ่มข้อมูลเสร็จสิ้น";
  }

  res.json({ message });
});

app.post("/createSectionPST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.ID_Project;
  const resDate = itemResponse.date;
  const resID_CST = itemResponse.id;
  const resAmount2 = itemResponse.amount;
  const res_ID_Set = itemResponse.ID_Set;
  const resAmount = parseInt(resAmount2, 10);

  const update = await models.Stem_Plantation.update(
    { numSelec: resAmount, dateSelec: resDate },
    { where: { ID_Project: resID_Pro, ID_Stem: resID_CST } }
  );

  const check = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Pro, ID_Set: res_ID_Set },
  });
  var ToTal = 0;
  for (let index = 0; index < check.length; index++) {
    const element = check[index].numSelec;
    console.log(2867, parseInt(element, 10));
    ToTal = ToTal + parseInt(element, 10);
  }
  const updateGroup = await models.Selection_Group.update(
    { ToTalAmout: ToTal },
    { where: { ID_Project: resID_Pro, ID_Set: res_ID_Set } }
  );
});

app.post("/getPST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "PST" },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  console.log(maxSize);
  const dataCST = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "PST" },
    limit: pageSize,
    offset: off,
  });

  res.json({ maxSize, dataCST, num });
});
app.post("/getSelectionPST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Selection_Group.findAll({
    where: { ID_Project: resID_Project, Step: "PST" },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  const dataSelection = await models.Selection_Group.findAll({
    where: { ID_Project: resID_Project, Step: "PST" },
    limit: pageSize,
    offset: off,
  });
  const dataPST = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "PST" },
  });
  const dataFarminProject = await models.Project_Farm.findAll({
    where: { ID_Project: resID_Project },
    logging: console.log,
  });

  const getFarmInFarm = await Promise.all(
    dataFarminProject.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Farm;
      console.log(item2);
      const dataProject = await models.Farm.findAll({
        where: { ID_Farm: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });
      console.log(ar);
      return ar;
    })
  );
  res.json({ dataSelection, maxSize, getFarmInFarm, dataPST });
});
//
app.post("/addSelecPST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const res_ID_Set = itemResponse.ID_Set;
  const res_ID_Stem = itemResponse.ID_Stem;
  const res_Num = itemResponse.num;
  const res_Date = itemResponse.date;
  var message = "";
  const add = await models.Stem_Plantation.update(
    { numSelec: res_Num, dateSelec: res_Date },
    {
      where: {
        ID_Project: resID_Project,
        ID_Set: res_ID_Set,
        ID_Stem: res_ID_Stem,
      },
    }
  );
  const check = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, ID_Set: res_ID_Set },
  });
  var ToTal = 0;
  for (let index = 0; index < check.length; index++) {
    const element = check[index].numSelec;

    ToTal = ToTal + parseInt(element, 10);
  }
  const update = await models.Selection_Group.update(
    { ToTalAmout: ToTal },
    { where: { ID_Project: resID_Project, ID_Set: res_ID_Set } }
  );
  message = "การเพิ่ม&แก้ไข จำนวนท่อนเสร็จสิ้น";
  res.json({ message });
});
app.post("/editPST", async (req, res) => {
  const itemResponse = req.body;
  const res_ID_Project = itemResponse.ID_Project;
  const res_ID_Stem = itemResponse.ID_Stem;
  const res_Date = itemResponse.newDate;
  const res_ID_Rep = itemResponse.newID_Rep;
  const res_Count = itemResponse.newCount;
  const edit = await models.Stem_Plantation.update(
    { Date: res_Date, ID_Rep: res_ID_Rep, Count: res_Count },
    { where: { ID_Project: res_ID_Project, ID_Stem: res_ID_Stem } }
  );
});
app.post("/deletePST", async (req, res) => {
  const itemResponse = req.body;
  const res_ID_Project = itemResponse.ID_Project;
  const res_ID_Stem = itemResponse.ID_Stem;
  const id_Set = itemResponse.ID_Set;
  console.log(id_Set);
  const de = await models.Stem_Plantation.destroy({
    where: { ID_Project: res_ID_Project, ID_Stem: res_ID_Stem },
  });
  const del = await models.Set_Group.destroy({
    where: { ID_Project: res_ID_Project, ID_Stem: res_ID_Stem },
  });
  const findAllPST = await models.Stem_Plantation.findAll({
    where: { ID_Project: res_ID_Project, Step: "PST", ID_Set: id_Set },
  });
  const get = await models.Selection_Group.update(
    { SumID: "" },
    {
      where: { ID_Project: res_ID_Project, Step: "PST", ID_Set: id_Set },
    }
  );

  let total = 0;
  for (let index = 0; index < findAllPST.length; index++) {
    const element = findAllPST[index].dataValues.ID_Stem;
    const get = await models.Selection_Group.findOne({
      where: { ID_Project: res_ID_Project, Step: "PST", ID_Set: id_Set },
    });

    let SumID = "";

    total = total + parseInt(findAllPST[index].numSelec);
    if (get.dataValues.SumID === "") {
      SumID = element;
    } else {
      SumID = get.dataValues.SumID + " , " + element;
    }

    const upDate = await models.Selection_Group.update(
      { SumID: SumID, ToTalAmout: total },
      { where: { ID_Project: res_ID_Project, Step: "PST", ID_Set: id_Set } }
    );
  }
  if (parseInt(findAllPST.length) === 0) {
    const de = await models.Selection_Group.destroy({
      where: { ID_Project: res_ID_Project, ID_Set: id_Set },
    });
  }
});
//
app.post("/addToAST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resData = itemResponse.data;
  const res_ID = itemResponse.ID;

  const checkAdd = await models.Stem_Plantation.findOne({
    where: { ID_Project: resID_Pro, Step: "AST", ID_Previous: res_ID },
  });
  let message = "";
  if (checkAdd) {
    message = "ตรวจพบข้อมูลซ้ำ";
  } else {
    var now = new Date().getFullYear() + 543;
    const getNo1 = await models.GenNumber.findOne({
      where: { ID_Project: resID_Pro, StepBy: "SET_AST" },
    });
    var a = "";
    if (getNo1) {
      var yearNo = parseInt(getNo1.dataValues.Year, 10);
      if (now > yearNo) {
        await models.GenNumber.update(
          { No: 1, Year: now },

          {
            where: {
              ID_Project: resID_Pro,
              StepBy: "SET_AST",
            },
          }
        );
        a = "AST" + now + "_set" + 1;
      } else {
        var No = parseInt(getNo1.dataValues.No, 10);
        var NoNext = No + 1;
        await models.GenNumber.update(
          { No: NoNext },
          {
            where: {
              ID_Project: resID_Pro,
              StepBy: "SET_AST",
            },
          }
        );
        a = "AST" + now + "_set" + NoNext;
      }
    } else {
      const createNo = await models.GenNumber.create({
        ID_Project: resID_Pro,
        No: 1,
        Year: now,
        StepBy: "SET_AST",
      });
      a = "AST" + now + "_set" + 1;
    }
    const id_Set = a;
    for (let index = 0; index < resData.length; index++) {
      const id_Previous = resData[index].chooseID;
      var idFarm = resData[index].addFarm;
      const farmName = await models.Farm.findOne({
        where: { ID_Farm: idFarm },
      });
      const res_Farmname = farmName.dataValues.FarmName;
      console.log(res_Farmname);
      const getNo = await models.GenNumber.findOne({
        where: { ID_Project: resID_Pro, StepBy: "AST" },
      });
      const findSproutPlanting = await models.Selection_Group.findOne({
        where: { ID_Project: resID_Pro, Step: "PST", ID_Set: res_ID },
      });

      const idSprout = findSproutPlanting.dataValues.ID_SproutPlanting;

      if (getNo) {
        var yearNo = parseInt(getNo.dataValues.Year, 10);
        if (now > yearNo) {
          await models.GenNumber.update(
            { No: 1, Year: now },
            {
              where: {
                ID_Project: resID_Pro,
                StepBy: "AST",
              },
            }
          );
          var a = "AST" + "_" + now + "_" + 1;
          const get = await models.Stem_Plantation.create({
            ID_Project: resID_Pro,
            ID_Stem: a,
            Step: "AST",
            ID_Previous: id_Previous,
            ID_SproutPlanting: idSprout,
            Date: resData[index].addDate,
            ID_Farm: resData[index].addFarm,
            FarmName: res_Farmname,
            ID_Block: resData[index].addBlock,
            ID_Unit: resData[index].addUnit,
            ID_Rep: resData[index].addRepID,
            Count: resData[index].addCount,
            ID_Set: id_Set,
            numSelec: 0,
            dateSelec: "",
          });
          const get2 = await models.Set_Group.create({
            ID_Project: resID_Pro,
            Step: "AST",
            ID_Stem: a,
            ID_SproutPlanting: idSprout,
            ID_Set: id_Set,
          });
        } else {
          var No = parseInt(getNo.dataValues.No, 10);
          var NoNext = No + 1;
          await models.GenNumber.update(
            { No: NoNext },
            {
              where: {
                ID_Project: resID_Pro,
                StepBy: "AST",
              },
            }
          );
          var a = "AST" + "_" + now + "_" + NoNext;
          const get = await models.Stem_Plantation.create({
            ID_Project: resID_Pro,
            ID_Stem: a,
            Step: "AST",
            ID_Previous: id_Previous,
            ID_SproutPlanting: idSprout,
            Date: resData[index].addDate,
            ID_Farm: resData[index].addFarm,
            FarmName: res_Farmname,
            ID_Block: resData[index].addBlock,
            ID_Unit: resData[index].addUnit,
            ID_Rep: resData[index].addRepID,
            Count: resData[index].addCount,
            ID_Set: id_Set,
            numSelec: 0,
            dateSelec: "",
          });
          const get2 = await models.Set_Group.create({
            ID_Project: resID_Pro,
            Step: "AST",
            ID_Stem: a,
            ID_SproutPlanting: idSprout,
            ID_Set: id_Set,
          });
        }
      } else {
        console.log("Create");
        const createNo = await models.GenNumber.create({
          ID_Project: resID_Pro,
          No: 1,
          Year: now,
          StepBy: "AST",
        });
        var a = "AST" + "_" + now + "_" + 1;
        const get = await models.Stem_Plantation.create({
          ID_Project: resID_Pro,
          ID_Stem: a,
          Step: "AST",
          ID_Previous: id_Previous,
          ID_SproutPlanting: idSprout,
          Date: resData[index].addDate,
          ID_Farm: resData[index].addFarm,
          FarmName: res_Farmname,
          ID_Block: resData[index].addBlock,
          ID_Unit: resData[index].addUnit,
          ID_Rep: resData[index].addRepID,
          Count: resData[index].addCount,
          ID_Set: id_Set,
          numSelec: 0,
          dateSelec: "",
        });
        const get2 = await models.Set_Group.create({
          ID_Project: resID_Pro,
          Step: "AST",
          ID_Stem: a,
          ID_SproutPlanting: idSprout,
          ID_Set: id_Set,
        });
      }
    }

    const findSproutPlanting = await models.Selection_Group.findOne({
      where: { ID_Project: resID_Pro, Step: "PST", ID_Set: res_ID },
    });
    const idSprout = findSproutPlanting.dataValues.ID_SproutPlanting;
    const createSelectoionGroup = await models.Selection_Group.create({
      ID_Project: resID_Pro,
      Step: "AST",
      ID_SproutPlanting: idSprout,
      ID_Set: id_Set,
      ToTalAmout: 0,
      SumID: "",
    });
    const findAllPST = await models.Stem_Plantation.findAll({
      where: { ID_Project: resID_Pro, Step: "AST", ID_Set: id_Set },
    });
    for (let index = 0; index < findAllPST.length; index++) {
      const element = findAllPST[index].dataValues.ID_Stem;
      console.log(2816, element);
      const get = await models.Selection_Group.findOne({
        where: { ID_Project: resID_Pro, Step: "AST", ID_Set: id_Set },
      });
      let = SumID = "";
      if (get.dataValues.SumID === "") {
        SumID = element;
      } else {
        SumID = get.dataValues.SumID + " , " + element;
      }
      const upDate = await models.Selection_Group.update(
        { SumID: SumID },
        { where: { ID_Project: resID_Pro, Step: "AST", ID_Set: id_Set } }
      );
    }
    message = "การเพิ่มข้อมูลเสร็จสิ้น";
  }

  res.json({ message });
});
app.post("/getAST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "AST" },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  console.log(maxSize);
  const dataCST = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "AST" },
    limit: pageSize,
    offset: off,
  });

  res.json({ maxSize, dataCST, num });
});
app.post("/getSelectionAST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Selection_Group.findAll({
    where: { ID_Project: resID_Project, Step: "AST" },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  const dataSelection = await models.Selection_Group.findAll({
    where: { ID_Project: resID_Project, Step: "AST" },
    limit: pageSize,
    offset: off,
  });
  const dataPST = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "AST" },
  });
  const dataFarminProject = await models.Project_Farm.findAll({
    where: { ID_Project: resID_Project },
    logging: console.log,
  });

  const getFarmInFarm = await Promise.all(
    dataFarminProject.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Farm;
      console.log(item2);
      const dataProject = await models.Farm.findAll({
        where: { ID_Farm: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });
      console.log(ar);
      return ar;
    })
  );
  res.json({ dataSelection, maxSize, getFarmInFarm, dataPST });
});
//
//
app.post("/addToRST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resData = itemResponse.data;
  const res_ID = itemResponse.ID;

  const checkAdd = await models.Stem_Plantation.findOne({
    where: { ID_Project: resID_Pro, Step: "RST", ID_Previous: res_ID },
  });
  let message = "";
  if (checkAdd) {
    message = "ตรวจพบข้อมูลซ้ำ";
  } else {
    var now = new Date().getFullYear() + 543;
    const getNo1 = await models.GenNumber.findOne({
      where: { ID_Project: resID_Pro, StepBy: "SET_RST" },
    });
    var a = "";
    if (getNo1) {
      var yearNo = parseInt(getNo1.dataValues.Year, 10);
      if (now > yearNo) {
        await models.GenNumber.update(
          { No: 1, Year: now },

          {
            where: {
              ID_Project: resID_Pro,
              StepBy: "SET_RST",
            },
          }
        );
        a = "RST" + now + "_set" + 1;
      } else {
        var No = parseInt(getNo1.dataValues.No, 10);
        var NoNext = No + 1;
        await models.GenNumber.update(
          { No: NoNext },
          {
            where: {
              ID_Project: resID_Pro,
              StepBy: "SET_RST",
            },
          }
        );
        a = "RST" + now + "_set" + NoNext;
      }
    } else {
      const createNo = await models.GenNumber.create({
        ID_Project: resID_Pro,
        No: 1,
        Year: now,
        StepBy: "SET_RST",
      });
      a = "RST" + now + "_set" + 1;
    }
    const id_Set = a;
    for (let index = 0; index < resData.length; index++) {
      const id_Previous = resData[index].chooseID;
      var idFarm = resData[index].addFarm;
      const farmName = await models.Farm.findOne({
        where: { ID_Farm: idFarm },
      });
      const res_Farmname = farmName.dataValues.FarmName;
      console.log(res_Farmname);
      const getNo = await models.GenNumber.findOne({
        where: { ID_Project: resID_Pro, StepBy: "RST" },
      });
      const findSproutPlanting = await models.Selection_Group.findOne({
        where: { ID_Project: resID_Pro, Step: "AST", ID_Set: res_ID },
      });

      const idSprout = findSproutPlanting.dataValues.ID_SproutPlanting;

      if (getNo) {
        var yearNo = parseInt(getNo.dataValues.Year, 10);
        if (now > yearNo) {
          await models.GenNumber.update(
            { No: 1, Year: now },
            {
              where: {
                ID_Project: resID_Pro,
                StepBy: "RST",
              },
            }
          );
          var a = "RST" + "_" + now + "_" + 1;
          const get = await models.Stem_Plantation.create({
            ID_Project: resID_Pro,
            ID_Stem: a,
            Step: "RST",
            ID_Previous: id_Previous,
            ID_SproutPlanting: idSprout,
            Date: resData[index].addDate,
            ID_Farm: resData[index].addFarm,
            FarmName: res_Farmname,
            ID_Block: resData[index].addBlock,
            ID_Unit: resData[index].addUnit,
            ID_Rep: resData[index].addRepID,
            Count: resData[index].addCount,
            ID_Set: id_Set,
            numSelec: 0,
            dateSelec: "",
          });
          const get2 = await models.Set_Group.create({
            ID_Project: resID_Pro,
            Step: "RST",
            ID_Stem: a,
            ID_SproutPlanting: idSprout,
            ID_Set: id_Set,
          });
        } else {
          var No = parseInt(getNo.dataValues.No, 10);
          var NoNext = No + 1;
          await models.GenNumber.update(
            { No: NoNext },
            {
              where: {
                ID_Project: resID_Pro,
                StepBy: "RST",
              },
            }
          );
          var a = "RST" + "_" + now + "_" + NoNext;
          const get = await models.Stem_Plantation.create({
            ID_Project: resID_Pro,
            ID_Stem: a,
            Step: "RST",
            ID_Previous: id_Previous,
            ID_SproutPlanting: idSprout,
            Date: resData[index].addDate,
            ID_Farm: resData[index].addFarm,
            FarmName: res_Farmname,
            ID_Block: resData[index].addBlock,
            ID_Unit: resData[index].addUnit,
            ID_Rep: resData[index].addRepID,
            Count: resData[index].addCount,
            ID_Set: id_Set,
            numSelec: 0,
            dateSelec: "",
          });
          const get2 = await models.Set_Group.create({
            ID_Project: resID_Pro,
            Step: "RST",
            ID_Stem: a,
            ID_SproutPlanting: idSprout,
            ID_Set: id_Set,
          });
        }
      } else {
        console.log("Create");
        const createNo = await models.GenNumber.create({
          ID_Project: resID_Pro,
          No: 1,
          Year: now,
          StepBy: "RST",
        });
        var a = "RST" + "_" + now + "_" + 1;
        const get = await models.Stem_Plantation.create({
          ID_Project: resID_Pro,
          ID_Stem: a,
          Step: "RST",
          ID_Previous: id_Previous,
          ID_SproutPlanting: idSprout,
          Date: resData[index].addDate,
          ID_Farm: resData[index].addFarm,
          FarmName: res_Farmname,
          ID_Block: resData[index].addBlock,
          ID_Unit: resData[index].addUnit,
          ID_Rep: resData[index].addRepID,
          Count: resData[index].addCount,
          ID_Set: id_Set,
          numSelec: 0,
          dateSelec: "",
        });
        const get2 = await models.Set_Group.create({
          ID_Project: resID_Pro,
          Step: "RST",
          ID_Stem: a,
          ID_SproutPlanting: idSprout,
          ID_Set: id_Set,
        });
      }
    }

    const findSproutPlanting = await models.Selection_Group.findOne({
      where: { ID_Project: resID_Pro, Step: "AST", ID_Set: res_ID },
    });
    const idSprout = findSproutPlanting.dataValues.ID_SproutPlanting;
    const createSelectoionGroup = await models.Selection_Group.create({
      ID_Project: resID_Pro,
      Step: "RST",
      ID_SproutPlanting: idSprout,
      ID_Set: id_Set,
      ToTalAmout: 0,
      SumID: "",
    });
    const findAllPST = await models.Stem_Plantation.findAll({
      where: { ID_Project: resID_Pro, Step: "RST", ID_Set: id_Set },
    });
    for (let index = 0; index < findAllPST.length; index++) {
      const element = findAllPST[index].dataValues.ID_Stem;
      console.log(2816, element);
      const get = await models.Selection_Group.findOne({
        where: { ID_Project: resID_Pro, Step: "RST", ID_Set: id_Set },
      });
      let = SumID = "";
      if (get.dataValues.SumID === "") {
        SumID = element;
      } else {
        SumID = get.dataValues.SumID + " , " + element;
      }
      const upDate = await models.Selection_Group.update(
        { SumID: SumID },
        { where: { ID_Project: resID_Pro, Step: "RST", ID_Set: id_Set } }
      );
    }
    message = "การเพิ่มข้อมูลเสร็จสิ้น";
  }

  res.json({ message });
});
app.post("/getRST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "RST" },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  console.log(maxSize);
  const dataCST = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "RST" },
    limit: pageSize,
    offset: off,
  });

  res.json({ maxSize, dataCST, num });
});
app.post("/getSelectionRST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Selection_Group.findAll({
    where: { ID_Project: resID_Project, Step: "RST" },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  const dataSelection = await models.Selection_Group.findAll({
    where: { ID_Project: resID_Project, Step: "RST" },
    limit: pageSize,
    offset: off,
  });
  const dataPST = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "RST" },
  });
  const dataFarminProject = await models.Project_Farm.findAll({
    where: { ID_Project: resID_Project },
    logging: console.log,
  });

  const getFarmInFarm = await Promise.all(
    dataFarminProject.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Farm;
      console.log(item2);
      const dataProject = await models.Farm.findAll({
        where: { ID_Farm: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });
      console.log(ar);
      return ar;
    })
  );
  res.json({ dataSelection, maxSize, getFarmInFarm, dataPST });
});
//
//
app.post("/addToFST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resData = itemResponse.data;
  const res_ID = itemResponse.ID;

  const checkAdd = await models.Stem_Plantation.findOne({
    where: { ID_Project: resID_Pro, Step: "FST", ID_Previous: res_ID },
  });
  let message = "";
  if (checkAdd) {
    message = "ตรวจพบข้อมูลซ้ำ";
  } else {
    var now = new Date().getFullYear() + 543;
    const getNo1 = await models.GenNumber.findOne({
      where: { ID_Project: resID_Pro, StepBy: "SET_FST" },
    });
    var a = "";
    if (getNo1) {
      var yearNo = parseInt(getNo1.dataValues.Year, 10);
      if (now > yearNo) {
        await models.GenNumber.update(
          { No: 1, Year: now },

          {
            where: {
              ID_Project: resID_Pro,
              StepBy: "SET_FST",
            },
          }
        );
        a = "FST" + now + "_set" + 1;
      } else {
        var No = parseInt(getNo1.dataValues.No, 10);
        var NoNext = No + 1;
        await models.GenNumber.update(
          { No: NoNext },
          {
            where: {
              ID_Project: resID_Pro,
              StepBy: "SET_FST",
            },
          }
        );
        a = "FST" + now + "_set" + NoNext;
      }
    } else {
      const createNo = await models.GenNumber.create({
        ID_Project: resID_Pro,
        No: 1,
        Year: now,
        StepBy: "SET_FST",
      });
      a = "FST" + now + "_set" + 1;
    }
    const id_Set = a;
    for (let index = 0; index < resData.length; index++) {
      const id_Previous = resData[index].chooseID;
      var idFarm = resData[index].addFarm;
      const farmName = await models.Farm.findOne({
        where: { ID_Farm: idFarm },
      });
      const res_Farmname = farmName.dataValues.FarmName;
      console.log(res_Farmname);
      const getNo = await models.GenNumber.findOne({
        where: { ID_Project: resID_Pro, StepBy: "FST" },
      });
      const findSproutPlanting = await models.Selection_Group.findOne({
        where: { ID_Project: resID_Pro, Step: "RST", ID_Set: res_ID },
      });

      const idSprout = findSproutPlanting.dataValues.ID_SproutPlanting;

      if (getNo) {
        var yearNo = parseInt(getNo.dataValues.Year, 10);
        if (now > yearNo) {
          await models.GenNumber.update(
            { No: 1, Year: now },
            {
              where: {
                ID_Project: resID_Pro,
                StepBy: "FST",
              },
            }
          );
          var a = "FST" + "_" + now + "_" + 1;
          const get = await models.Stem_Plantation.create({
            ID_Project: resID_Pro,
            ID_Stem: a,
            Step: "FST",
            ID_Previous: id_Previous,
            ID_SproutPlanting: idSprout,
            Date: resData[index].addDate,
            ID_Farm: resData[index].addFarm,
            FarmName: res_Farmname,
            ID_Block: resData[index].addBlock,
            ID_Unit: resData[index].addUnit,
            ID_Rep: resData[index].addRepID,
            Count: resData[index].addCount,
            ID_Set: id_Set,
            numSelec: 0,
            dateSelec: "",
          });
          const get2 = await models.Set_Group.create({
            ID_Project: resID_Pro,
            Step: "FST",
            ID_Stem: a,
            ID_SproutPlanting: idSprout,
            ID_Set: id_Set,
          });
        } else {
          var No = parseInt(getNo.dataValues.No, 10);
          var NoNext = No + 1;
          await models.GenNumber.update(
            { No: NoNext },
            {
              where: {
                ID_Project: resID_Pro,
                StepBy: "FST",
              },
            }
          );
          var a = "FST" + "_" + now + "_" + NoNext;
          const get = await models.Stem_Plantation.create({
            ID_Project: resID_Pro,
            ID_Stem: a,
            Step: "FST",
            ID_Previous: id_Previous,
            ID_SproutPlanting: idSprout,
            Date: resData[index].addDate,
            ID_Farm: resData[index].addFarm,
            FarmName: res_Farmname,
            ID_Block: resData[index].addBlock,
            ID_Unit: resData[index].addUnit,
            ID_Rep: resData[index].addRepID,
            Count: resData[index].addCount,
            ID_Set: id_Set,
            numSelec: 0,
            dateSelec: "",
          });
          const get2 = await models.Set_Group.create({
            ID_Project: resID_Pro,
            Step: "FST",
            ID_Stem: a,
            ID_SproutPlanting: idSprout,
            ID_Set: id_Set,
          });
        }
      } else {
        console.log("Create");
        const createNo = await models.GenNumber.create({
          ID_Project: resID_Pro,
          No: 1,
          Year: now,
          StepBy: "FST",
        });
        var a = "FST" + "_" + now + "_" + 1;
        const get = await models.Stem_Plantation.create({
          ID_Project: resID_Pro,
          ID_Stem: a,
          Step: "FST",
          ID_Previous: id_Previous,
          ID_SproutPlanting: idSprout,
          Date: resData[index].addDate,
          ID_Farm: resData[index].addFarm,
          FarmName: res_Farmname,
          ID_Block: resData[index].addBlock,
          ID_Unit: resData[index].addUnit,
          ID_Rep: resData[index].addRepID,
          Count: resData[index].addCount,
          ID_Set: id_Set,
          numSelec: 0,
          dateSelec: "",
        });
        const get2 = await models.Set_Group.create({
          ID_Project: resID_Pro,
          Step: "FST",
          ID_Stem: a,
          ID_SproutPlanting: idSprout,
          ID_Set: id_Set,
        });
      }
    }

    const findSproutPlanting = await models.Selection_Group.findOne({
      where: { ID_Project: resID_Pro, Step: "RST", ID_Set: res_ID },
    });
    const idSprout = findSproutPlanting.dataValues.ID_SproutPlanting;
    const createSelectoionGroup = await models.Selection_Group.create({
      ID_Project: resID_Pro,
      Step: "FST",
      ID_SproutPlanting: idSprout,
      ID_Set: id_Set,
      ToTalAmout: 0,
      SumID: "",
    });
    const findAllPST = await models.Stem_Plantation.findAll({
      where: { ID_Project: resID_Pro, Step: "FST", ID_Set: id_Set },
    });
    for (let index = 0; index < findAllPST.length; index++) {
      const element = findAllPST[index].dataValues.ID_Stem;
      console.log(2816, element);
      const get = await models.Selection_Group.findOne({
        where: { ID_Project: resID_Pro, Step: "FST", ID_Set: id_Set },
      });
      let = SumID = "";
      if (get.dataValues.SumID === "") {
        SumID = element;
      } else {
        SumID = get.dataValues.SumID + " , " + element;
      }
      const upDate = await models.Selection_Group.update(
        { SumID: SumID },
        { where: { ID_Project: resID_Pro, Step: "FST", ID_Set: id_Set } }
      );
    }
    message = "การเพิ่มข้อมูลเสร็จสิ้น";
  }

  res.json({ message });
});
app.post("/getFST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "FST" },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  console.log(maxSize);
  const dataCST = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "FST" },
    limit: pageSize,
    offset: off,
  });

  res.json({ maxSize, dataCST, num });
});
app.post("/getSelectionFST", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.Selection_Group.findAll({
    where: { ID_Project: resID_Project, Step: "FST" },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  const dataSelection = await models.Selection_Group.findAll({
    where: { ID_Project: resID_Project, Step: "FST" },
    limit: pageSize,
    offset: off,
  });
  const dataPST = await models.Stem_Plantation.findAll({
    where: { ID_Project: resID_Project, Step: "FST" },
  });
  const dataFarminProject = await models.Project_Farm.findAll({
    where: { ID_Project: resID_Project },
    logging: console.log,
  });

  const getFarmInFarm = await Promise.all(
    dataFarminProject.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Farm;
      console.log(item2);
      const dataProject = await models.Farm.findAll({
        where: { ID_Farm: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });
      console.log(ar);
      return ar;
    })
  );
  res.json({ dataSelection, maxSize, getFarmInFarm, dataPST });
});
//
//
//
//
//
//
//
//
//
//

//

//

app.post("/getGrowFarmBlockPlot_With_Compare", async (req, res) => {
  const itemResponse = req.body;
  const res_id = itemResponse.id;
  const res_ID_Project = itemResponse.toProID;
  const get = await models.CheckVariety.findOne({
    where: { ID_Project: res_ID_Project, ID_Compare: res_id },
  });
  var Farm = get.dataValues.FarmName;
  var Block = get.dataValues.ID_Block;
  var Unit = get.dataValues.ID_Unit;
  res.json({
    Farm,
    Block,
    Unit,
  });
});
app.post("/getGrowFarmBlockPlot", async (req, res) => {
  const itemResponse = req.body;
  const res_id = itemResponse.id;
  const res_ID_Project = itemResponse.toProID;
  const get = await models.Stem_Plantation.findOne({
    where: { ID_Project: res_ID_Project, ID_Stem: res_id },
  });
  var Farm = get.dataValues.FarmName;
  var Block = get.dataValues.ID_Block;
  var Unit = get.dataValues.ID_Unit;
  res.json({
    Farm,
    Block,
    Unit,
  });
});

app.post("/getCompare", async (req, res) => {
  const itemResponse = req.body;
  const resID_Project = itemResponse.toProID;
  const pageNumber = itemResponse.page;
  const pageSize = itemResponse.size;
  const off = (pageNumber - 1) * pageSize;
  const num = await models.CheckVariety.findAll({
    where: { ID_Project: resID_Project },
  });
  var maxSize = num.length / pageSize;
  if (maxSize >= 0.1 && maxSize <= 0.4) {
    maxSize = 1;
  }
  var maxSize = Math.ceil(maxSize);
  console.log(maxSize);
  const dataCom = await models.CheckVariety.findAll({
    where: { ID_Project: resID_Project },
    limit: pageSize,
    offset: off,
  });
  const getVarieties = await models.Variety.findAll({
    where: { ID_Project: resID_Project },
    logging: console.log,
  });
  const dataFarminProject = await models.Project_Farm.findAll({
    where: { ID_Project: resID_Project },
    logging: console.log,
  });
  const getFarmInFarm = await Promise.all(
    dataFarminProject.map(async item => {
      let item2 = {};
      let ar = [];
      item2 = item.dataValues.ID_Farm;
      console.log(item2);
      const dataProject = await models.Farm.findAll({
        where: { ID_Farm: item2 },
      });
      const result = dataProject.map(test => {
        if (test.dataValues == null) {
        } else {
          ar = test.dataValues;
        }
      });
      console.log(ar);
      return ar;
    })
  );
  res.json({ getFarmInFarm, maxSize, dataCom, num, getVarieties });
});
app.post("/createCompare", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.toProID;
  const resDate = itemResponse.addDate;
  const resCode = itemResponse.code;
  const resVariety = itemResponse.chooseVariety;
  const resRepID = itemResponse.addRepID;
  const resFarm = itemResponse.addFarm;
  const resUnit = itemResponse.addUnit;
  const resBlock = itemResponse.addBlock;
  const resAmount2 = itemResponse.addCount;
  const resAmount = parseInt(resAmount2, 10);
  const farm = await models.Farm.findOne({
    where: { ID_Farm: resFarm },
  });
  const farmName = farm.dataValues.FarmName;
  var now = new Date().getFullYear() + 543;
  const getNo = await models.GenNumber.findOne({
    where: { ID_Project: resID_Pro, StepBy: "Compare" },
  });
  console.log("Check");
  if (getNo) {
    var yearNo = parseInt(getNo.dataValues.Year, 10);
    if (now > yearNo) {
      await models.GenNumber.update(
        { No: 1, Year: now },

        {
          where: {
            ID_Project: resID_Pro,
            StepBy: "Compare",
          },
        }
      );
      var a = "cp" + "_" + now + "_" + 1;
      const get = await models.CheckVariety.create({
        ID_Compare: a,
        ID_Project: resID_Pro,
        code: resCode,
        ID_Breeder: resVariety,
        Date: resDate,
        Amount: resAmount,
        ID_Farm: resFarm,
        ID_Block: resBlock,
        ID_Unit: resUnit,
        Rep_ID: resRepID,
        FarmName: farmName,
      });
    } else {
      var No = parseInt(getNo.dataValues.No, 10);
      var NoNext = No + 1;
      await models.GenNumber.update(
        { No: NoNext },
        {
          where: {
            ID_Project: resID_Pro,
            StepBy: "Compare",
          },
        }
      );

      var a = "cp" + "_" + now + "_" + NoNext;
      const get = await models.CheckVariety.create({
        ID_Project: resID_Pro,
        code: resCode,
        ID_Breeder: resVariety,
        Date: resDate,
        Amount: resAmount,
        ID_Farm: resFarm,
        ID_Block: resBlock,
        ID_Unit: resUnit,
        ID_Compare: a,
        Rep_ID: resRepID,
        FarmName: farmName,
      });
    }
  } else {
    console.log("Create");
    const createNo = await models.GenNumber.create({
      ID_Project: resID_Pro,
      No: 1,
      Year: now,
      StepBy: "Compare",
    });
    var a = "cp" + "_" + now + "_" + 1;
    const get = await models.CheckVariety.create({
      ID_Project: resID_Pro,
      code: resCode,
      ID_Breeder: resVariety,
      Date: resDate,
      Amount: resAmount,
      ID_Farm: resFarm,
      ID_Block: resBlock,
      ID_Compare: a,
      ID_Unit: resUnit,
      Rep_ID: resRepID,
      FarmName: farmName,
    });
  }
});

app.post("/editCompare", async (req, res) => {
  const itemResponse = req.body;
  const resID_Pro = itemResponse.ID_Project;
  const resID_Compare = itemResponse.ID_Compare;
  const resDate = itemResponse.newDate;
  const resCount = itemResponse.newCount;
  const de = await models.CheckVariety.update(
    {
      Date: resDate,

      Amount: resCount,
    },
    { where: { ID_Project: resID_Pro, ID_Compare: resID_Compare } }
  );
});
app.post("/deleteCompare", async (req, res) => {
  const itemResponse = req.body;
  const resID_Compare = itemResponse.ID_Compare;
  const resID_Pro = itemResponse.ID_Project;

  await models.CheckVariety.destroy({
    where: {
      ID_Project: resID_Pro,
      ID_Compare: resID_Compare,
    },
  });
});

app.post("/getTest", async (req, res) => {
  const itemResponse = req.body;
  const Iduser = itemResponse.idUser;

  const massage = await models.Massage.findAll({
    where: { ID_user: Iduser, Status: 0 },
  });
  res.json({ massage });
});
app.post("/addTest", async (req, res) => {
  const itemResponse = req.body;
  const Iduser = itemResponse.idUser;

  const massage = await models.Massage.create({
    ID_user: Iduser,
    Email: "0",
    ID_Project: "0",
    ProjectName: "0",
    Status: 0,
    Massage: "0",
  });

  return res.json({ message: "success" });
});
app.listen(3005, () => console.log("Until"));
// app.post("/getTest", async (req, res) => {
//   const itemResponse = req.body;
//   const pageNumber = itemResponse.page;
//   const pageSize = itemResponse.size;
//   const off = (pageNumber - 1) * pageSize;
//   const get = await models.User.findAll({
//     where: { Status: "1" },
//     limit: pageSize,
//     offset: off,
//   });
//   console.log(get);
//   res.json({ get });
// });

// app.post("/profile/user", async (req, res) => {
//   const response = req.body;
//   const snapshot = await db
//     .collection("users")
//     .where("useremail", "==", response.email)
//     .get();

//   if (snapshot.empty) {
//     console.log("No matching documents.");
//     return;
//   }
//   snapshot.forEach((doc) => {
//     const data2 = doc.data();
//     const userphotolink = data2.userphotolink;
//     const userfristname = data2.userfristname;
//     const userlastname = data2.userlastname;
//     res.json({
//       userphotolink,
//       userfristname,
//       userlastname,
//     });
//   });
// });

// app.post("/profile", async (req, res) => {
//   const link = req.body;
//   const data = await db.collection("users").doc(link.email).update({
//     userfristname: link.Fname,
//     userlastname: link.Lname,
//     userphotolink: link.url2,
//   });
//   res.json(data);
// });

// app.post("/blog", async (req, res) => {
//   const count = 0;
//   const ojb = req.body;
//   console.log(ojb.email);
//   console.log(ojb.data);
//   console.log(ojb.data2);

//   const fire = await db.collection("Blog").add({
//     T1: ojb.data,
//     T2: ojb.data2,
//   });
//   const snapshot = await db.collection("Blog").get();

//   const data = await Promise.all(
//     snapshot.docs.map(async (doc) => {
//       let item = [];
//       item = doc.data();
//       return item;
//     })
//   );
//   console.log(data);
//   res.json({ data });
// });
// app.get("/Blog", async (req, res) => {
//   const snapshot = await db.collection("Blog").get();

//   const data = await Promise.all(
//     snapshot.docs.map(async (doc) => {
//       let item = [];
//       item = doc.data();
//       return item;
//     })
//   );
//   console.log({ data });
//   res.json({ data });
// });
// app.post("/plots", async (req, res) => {
//   const datareq = req.body;
//   const req_name = datareq.name;
//   const req_id = datareq.id;
//   const req_address = datareq.address;
//   const add = await db.collection("Plots").add({
//     Plot_id: req_id,
//     Plot_name: req_name,
//     Plot_Address: req_address,
//   });
//   const snapshot = await db.collection("Plots").get();
//   const data = await Promise.all(
//     snapshot.docs.map(async (doc) => {
//       let item = [];
//       item = doc.data();
//       return item;
//     })
//   );
//   console.log(data);
//   res.json({ data });
// });
// app.get("/plots", async (req, res) => {
//   const snapshot = await db.collection("Plots").get();
//   const data = await Promise.all(
//     snapshot.docs.map(async (doc) => {
//       let item = [];
//       item = doc.data();
//       return item;
//     })
//   );
//   console.log(data);
//   res.json({ data });
// });
