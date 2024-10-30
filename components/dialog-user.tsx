"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useStore } from "@/store/store";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReloadIcon } from "@radix-ui/react-icons";

import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editUser, saveUser } from "@/_actions/userAction";
import { useEffect } from "react";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "El usuario debe de tener al menos 2 caracteres",
  }),
  email: z.string().email({ message: "Email Invalido" }),
});

export default function DialogUser() {
  const user = useStore((state) => state.userSelected);
  console.log(user?.username);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: user?.username ?? "",
      email: user?.email ?? "",
    },
  });

  const formState = form.formState;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { username, email } = data;
    const user = { username, email };
    let res = {
      success: false,
      error: "",
      message: "",
    };
    try {
      if (formMode === 2) {
        res = await editUser(user);
      } else if (formMode === 1) {
        res = await saveUser({
          ...user,
          password: "usuario",
        });
      }

      if (res.success) {
        toast.success(res.message, {
          description: (
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          ),
          position: "top-right",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(res.error, {
          position: "top-right",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const open = useStore((state) => state.open);
  const changeOpen = useStore((state) => state.changeOpen);
  const formMode = useStore((state) => state.formMode);

  console.log(user?.username);

  useEffect(() => {
    if (open && user) {
      form.reset({
        username: user.username,
        email: user.email,
      });
    }
  }, [open, user, form, formMode]);

  return (
    <>
      {open && (
        <Dialog open={open as boolean} onOpenChange={changeOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {formMode === 2 ? "Editar Usuario" : "Agregar usuario"}
              </DialogTitle>
              <DialogDescription>
                Haz cambios en tu perfil aquí. Haz clic en Guardar cuando hayas
                terminado.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="usuario" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!formState.isSubmitting ? (
                  <Button type="submit" className=" mt-6 col-span-2">
                    Guardar cambios
                  </Button>
                ) : (
                  <Button disabled className="mt-6">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />
                    Please wait
                  </Button>
                )}
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
