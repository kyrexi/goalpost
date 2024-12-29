import { CheckCircle } from "lucide-react";

export default function About() {
  const features = [
    "Set personalized goals with custom deadlines",
    "Receive email reminders on your goal date",
    "User-friendly interface for easy goal management",
    "Secure and private goal storage",
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">About GoalPost</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          GoalPost is your personal assistant for achieving your dreams. Our app
          helps you set and track your goals with ease.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              <p className="text-gray-700">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
