import Link from "next/link";


export default function Footer(){
    const currentYear = new Date().getFullYear(); //automatically updates the copyright year

    return(
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* column 1 */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            STRIVE

                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            strive seo checking app

                        </p>
                    </div>
                    {/* column 2 */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                href="/about"
                                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    About Us
                                </Link>

                            </li>
                            <li>
                                <Link
                                href="/contact"
                                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    Contact
                                </Link>
                                
                            </li>
                            <li>
                                <Link
                                href="/pricing"
                                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    Pricing
                                </Link>
                                
                            </li>
                        </ul>
                    </div>
                    
                </div>
                {/* Bottom bar : copyright */}
                <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400">
                        &copy; {currentYear} YourApp Inc. All rights reserved
                    </p>
                    {/* optional : social icons space*/}
                    <div className="flex space-x-6 mt-4 md:mt-0 text-gray-400">
                        <span className="hover:text-gray-500 cursor-pointer text-sm">Twitter</span>

                    </div>

                </div>

            </div>

        </footer>
    )
}