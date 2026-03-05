"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
	email: z.string().email("Informe um e-mail válido."),
	password: z.string().min(1, "Informe sua senha."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function onSubmit() {
		toast.success("Login enviado com sucesso.");
	}

	return (
		<section className="mx-auto flex w-full max-w-md flex-col gap-6 py-10">
			<div className="space-y-2 text-center">
				<p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
					Área do cliente
				</p>
				<h1 className="text-3xl font-semibold">Entrar</h1>
				<p className="text-sm text-muted-foreground">
					Acesse sua conta para acompanhar pedidos, pagamentos e resultados.
				</p>
			</div>

			<Card className="border-border/80 bg-card/80">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Use seu e-mail e senha cadastrados.</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							className="space-y-4"
							onSubmit={form.handleSubmit(onSubmit)}
							noValidate
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="email"
												autoComplete="email"
												placeholder="voce@exemplo.com"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Senha</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="password"
												autoComplete="current-password"
												placeholder="********"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button className="w-full" type="submit">
								Entrar
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>

			<p className="text-center text-sm text-muted-foreground">
				Não tem conta?{" "}
				<Link
					href="/register"
					className="font-medium text-primary hover:underline"
				>
					Criar conta
				</Link>
			</p>
		</section>
	);
}
