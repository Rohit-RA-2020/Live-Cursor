"use client";

import { Client, Account, Databases } from "appwrite";
import sdk, { Permission, Role, ID } from "node-appwrite";

class ServerConfig {
  client: sdk.Client = new sdk.Client();
  databases: sdk.Databases = new sdk.Databases(this.client);
  key: string = `${process.env.NEXT_PUBLIC_APIKEY}`;

  constructor() {
    this.client
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(`${process.env.NEXT_PUBLIC_PROJECTID}`)
      .setKey(this.key);
  }

  createRoom(name: string, creatorId: string) {
    try {
      this.databases
        .createCollection(
          `${process.env.NEXT_PUBLIC_DATABASEID}`,
          ID.unique(),
          name,
          [
            Permission.read(Role.any()), // Anyone can view this document
            Permission.update(Role.any()), // Writers can update this document
            Permission.create(Role.any()), // Admins can update this document
            Permission.delete(Role.user(creatorId)),
          ]
        )
        .then((res) => {
          this.databases.createStringAttribute(
            `${process.env.NEXT_PUBLIC_DATABASEID}`,
            res.$id,
            "name",
            50,
            true
          );
          this.databases.createStringAttribute(
            `${process.env.NEXT_PUBLIC_DATABASEID}`,
            res.$id,
            "email",
            100,
            true
          );
          this.databases.createBooleanAttribute(
            `${process.env.NEXT_PUBLIC_DATABASEID}`,
            res.$id,
            "creator",
            false
          );
          this.databases.createFloatAttribute(
            `${process.env.NEXT_PUBLIC_DATABASEID}`,
            res.$id,
            "x_point",
            false
          );
          this.databases.createFloatAttribute(
            `${process.env.NEXT_PUBLIC_DATABASEID}`,
            res.$id,
            "y_point",
            false
          );
          this.databases.createUrlAttribute(
            `${process.env.NEXT_PUBLIC_DATABASEID}`,
            res.$id,
            "image",
            true,
          )
          console.table(res);
        });
    } catch (error) {
      console.log(error);
    }
  }
}

class AppwriteConfig {
  databaseId: string = `${process.env.NEXT_PUBLIC_DATABASEID}`;

  client: Client = new Client();
  account: Account = new Account(this.client);
  databases: Databases = new Databases(this.client);

  constructor() {
    this.client
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(`${process.env.NEXT_PUBLIC_PROJECTID}`);
  }

  googlelog(): void {
    try {
      this.account.createOAuth2Session(
        "google",
        `${process.env.NEXT_PUBLIC_APPURL}/login/sucess`,
        `${process.env.NEXT_PUBLIC_APPURL}/login/failure`,
        []
      );
      this.getCurUser();
    } catch (error) {
      console.log(error);
    }
  }

  getCurUser(): void {
    try {
      this.account
        .get()
        .then((res) => {
          localStorage.setItem("userInfo", JSON.stringify(res));
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  signOut(id: string): boolean {
    try {
      this.account.deleteSession(id);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export { AppwriteConfig, ServerConfig };
