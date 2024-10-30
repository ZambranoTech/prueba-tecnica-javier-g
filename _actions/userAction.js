"use server";

import UserModel from "@/models/userModel";
import connectDB from "@/config/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export const getAllUsers = async () => {
  try {
    await connectDB();

    const users = JSON.parse(JSON.stringify(await UserModel.find()));

    console.log(users);
    return { users };
  } catch (error) {
    return { error: error.message };
  }
};

export const saveUser = async (user) => {
  console.log(user);
  try {
    await connectDB();
    const newUser = new UserModel(user);

    await newUser.save();

    return { success: true, message: "Usuario guardado con éxito" };
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      error: error.message ?? "Error al guardar usuario",
    };
  }
};

export const deleteUser = async (user) => {
  try {
    await connectDB();
    const result = await UserModel.deleteOne({ username: user.username });
    console.log(result);

    if (result.deletedCount === 0) {
      toast.error("Usuario no encontrado", {
        position: "top-right",
      });
    }
    toast.success("Eliminación exitosa", {
      description: (
        <code className="text-white">Usuario eliminado con éxito</code>
      ),
      position: "top-right",
    });
    revalidatePath("/dashboard");
    redirect("/");
  } catch (error) {
    return {
      success: false,
      error: error.message ?? "Error al eliminar usuario",
    };
  }
};

export const loginUser = async (user) => {
  try {
    await connectDB();
    const result = await UserModel.findOne({
      username: user.username,
      password: user.password,
    });

    if (result.findOne === 0) {
      return { success: false, error: "Usuario no encontrado" };
    }

    console.log({
      success: true,
      message: "Usuario encontrado con éxito",
      username: result.username,
    });

    return {
      success: true,
      message: "Usuario encontrado con éxito",
      username: result.username,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message ?? "Error al eliminar usuario",
    };
  }
};

export const editUser = async (user) => {
  try {
    await connectDB();

    const result = await UserModel.findOneAndUpdate(
      { email: user.email },
      { ...user },
      { new: true }
    );

    if (!result) {
      return { success: false, error: "Usuario no encontrado" };
    }

    console.log("Usuario actualizado con éxito");
  
    return {
      success: true,
      message: "Usuario actualizado con éxito",
      user: result.username,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message ?? "Error al actualizar usuario",
    };
  }
};
