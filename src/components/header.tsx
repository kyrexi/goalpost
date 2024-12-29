import Link from "next/link";
import { GiSoccerBall } from "react-icons/gi";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-md p-1 md:p-4 text-lg font-semibold md:font-bold font-mono">
      <nav className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-1">
          <GiSoccerBall />
          GoalPost
        </Link>
        <div className="flex">
          <Button asChild variant={"link"}>
            <Link href={"/#create"}>Score a goal</Link>
          </Button>
          <Button asChild variant={"link"}>
            <Link href={"/#about"}>About</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
