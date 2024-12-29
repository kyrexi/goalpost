import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { GiSoccerBall } from "react-icons/gi";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
              <GiSoccerBall />
              GoalPost
            </h3>
            <p className="text-sm">
              Set and get reminded of your goals. Stay motivated and achieve.
            </p>
          </div>
          <div>
            <Link href={"https://github.com/kyrexi/goalpost"}>
              <FaGithub />
            </Link>
          </div>
        </div>
        <div className="mt-4 pt-2 border-t border-gray-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Kyrexi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
