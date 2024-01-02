import { useSession } from "next-auth/react";

const { data: session } = useSession();

useEffect(() => {
}, [session]);


{ session && session?.user.name }