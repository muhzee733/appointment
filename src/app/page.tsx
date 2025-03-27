import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { config } from '@/config';
import Category from '@/components/webiste/Category';
import Faqs from '@/components/webiste/Faqs';
import HowItWork from '@/components/webiste/HowItWork';
import ServicesTab from '@/components/webiste/ServicesTab';

import '@/styles/custom.css';
import '@/styles/style.css';

export const metadata = {
  title: `Home | ${config.site.name}`,
} satisfies Metadata;

export default function Page() {
  return (
    <div>
      <header className="header-wrapper">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <div className="row w-100">
              {/* Logo and Hamburger Icon */}
              <div className="col-lg-2 col-md-12 d-flex align-items-center justify-content-between">
                <Link className="navbar-brand logo" href="/">
                  <img src="/assets/pro-logo.png" alt="logo" className="mobile-menu img-fluid" />
                </Link>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              </div>

              {/* Navbar Links */}
              <div className="col-lg-10 col-md-12 d-flex align-items-center">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <div className="container container-style1 position-relative">
                    <div className="row align-items-center justify-content-between justify-content-md-end">
                      <div className="col-xl-9 col-md-9 text-end text-lg-center">
                        <nav className="main-menu menu-style1">
                          <ul className="burger-menu" style={{ textAlign: 'right' }}>
                            <li className="mega-menu-wrap">
                              <Link href="/">Home</Link>
                            </li>
                            <li className="mega-menu-wrap">
                              <Link href="#how-it-works">How it works</Link>
                            </li>
                            <li>
                              <Link href="#pricing">Pricing</Link>
                            </li>
                            <li>
                              <Link href="#about">About Us</Link>
                            </li>
                            <li>
                              <Link href="#faqs">FAQs</Link>
                            </li>
                          </ul>
                        </nav>
                      </div>
                      {/* Call to Action Button */}
                      <div className="col-xl-3 col-md-3 d-lg-flex justify-content-end gap-3 custom-button">
                        <Link href="/questions" className="vs-btn">
                          Start Questionnaire
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <ServicesTab />
      <Category />
      <HowItWork />
      <Faqs />
      <footer className="footer-wrapper footer bg-theme py-130">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center text-white">
              <div className="text-center mb-5">
                <img src="/assets/pro-logo.webp" width={230} alt="logo" className="mobile-menu" />
              </div>
              <div className="mb-5">
                <h4 className="text-white">Get in Touch</h4>
                <p className="text-white">We’re available Mon-Fri, 9am-5am (AEST)</p>
              </div>
              <div className="footer-container mb-5">
                <h4 className="text-white">About Us</h4>
                <p className="text-white">
                  We’re an online pharmacist and doctor-backed platform providing in-home telehealth consultations and
                  electronic medical certificates.
                </p>
              </div>
              <div className="footer-container">
                <div className="row">
                  <div className="col-lg-4">
                    <i className="fa fa-address-book me-2"></i>
                    <span>Brisbane 4000, Australia</span>
                  </div>
                  <div className="col-lg-5 p-0 text-center">
                    <i className="fa fa-envelope me-2"></i>
                    <span>contact@frazmedicall.com.au</span>
                  </div>
                  <div className="col-lg-3">
                    <i className="fa fa-envelope me-2"></i>
                    <span>frazmedicall</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
