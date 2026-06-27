import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Container from "@/components/container/Container";

export default function ContactUsView() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10" />

        <div className="container mx-auto px-4 text-center relative">
          <span className="rounded-full border px-4 py-2 text-sm font-medium">
            Contact EduNext
          </span>

          <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight">
            {`Let's`} Build Your
            <span className="block bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
              Learning Journey
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground text-lg">
            Have questions about courses, instructors, or enrollment? Our team
            is ready to help.
          </p>
        </div>
      </section>

      <Container>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Mail,
              title: "Email 1",
              value: "rezakazemi1381@yahoo.com",
            },
            {
              icon: Mail,
              title: "Email 2",
              value: "abolfazlmnf83@gmail.com",
            },
            {
              icon: Phone,
              title: "Phone",
              value: "+98 911 956 1084",
            },
            {
              icon: MapPin,
              title: "Location",
              value: "Sari, Iran",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border bg-card p-6 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="font-semibold">{item.title}</h3>

              <p className="mt-2 text-sm text-muted-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </Container>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold">Send us a message</h2>

            <p className="mt-4 text-muted-foreground">
              Fill out the form and our team will get back to you within 24
              hours.
            </p>
          </div>

          <div className="rounded-3xl border bg-card p-8 shadow-lg">
            <form className="space-y-5">
              <Input placeholder="Your Name" />

              <Input placeholder="Email Address" type="email" />

              <Input placeholder="Subject" />

              <Textarea
                placeholder="Write your message..."
                className="min-h-[150px]"
              />

              <Button className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </Container>
      <Container>
        <div className="rounded-[32px] border bg-card p-8">
          <h2 className="mb-8 text-center text-4xl font-bold">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              "How do I enroll in a course?",
              "Can I get a refund?",
              "Do courses include certificates?",
              "How can I contact an instructor?",
            ].map((item) => (
              <div key={item} className="rounded-2xl border p-5">
                <h3 className="font-medium">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
