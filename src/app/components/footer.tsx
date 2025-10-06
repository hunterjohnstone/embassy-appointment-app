interface FooterProps {
  copyright: string;
}

export default function Footer({ copyright }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white py-6 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-600 text-sm">{copyright} @ {new Date().getFullYear()}</p>
        <p className="text-gray-600 text-sm">E: contact@embassyalerts.com</p>
      </div>
    </footer>
  );
}