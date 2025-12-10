import { useQuery } from "@tanstack/react-query";
import { AuthButton } from "./components/shared/AuthButton";
import { useAuth } from "./context/AuthContext";

type Account = {
	name: string | null;
	accountnumber: string | null;
	accountid: string;
};

function App() {
	const { isAuthenticated, user } = useAuth();

	const { data: accounts, isLoading } = useQuery({
		queryKey: ["accounts"],
		queryFn: async () => {
			const response = await fetch(
				`_api/accounts?$select=name,accountnumber&$top=5`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user?.idToken}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		},
		enabled: isAuthenticated && !!user,
	});

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<div>Loading...</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen gap-4">
			{accounts ? (
				<div>
					<h2 className="mb-4 text-xl font-bold">Accounts:</h2>
					<ul className="list-disc list-inside">
						{accounts.value.map((account: Account) => (
							<li key={account.accountid}>
								{account.name} - {account.accountnumber}
							</li>
						))}
					</ul>
				</div>
			) : (
				<div>
					{isAuthenticated ? (
						<div>No accounts data available.</div>
					) : (
						<>
							<div>Please log in to view your accounts.</div>
							<AuthButton />
						</>
					)}
				</div>
			)}
		</div>
	);
}

export default App;
