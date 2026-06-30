/** State medical / licensing board lookup URLs for user verification. */

type BoardInfo = {
  name: string;
  url: string;
};

const STATE_BOARDS: Record<string, BoardInfo> = {
  AL: { name: "Alabama Board of Medical Examiners", url: "https://www.albme.gov/licensee-search/" },
  AK: { name: "Alaska State Medical Board", url: "https://www.commerce.alaska.gov/cbp/Main/SearchProfessional" },
  AZ: { name: "Arizona Medical Board", url: "https://azbomv7prod.glsuite.us/GLSuiteWeb/Clients/AZBOM/Public/Verification.aspx" },
  AR: { name: "Arkansas State Medical Board", url: "https://www.armedicalboard.org/Public/verify/default.aspx" },
  CA: { name: "Medical Board of California", url: "https://search.dca.ca.gov/" },
  CO: { name: "Colorado Medical Board", url: "https://apps2.colorado.gov/dora/licensing/Lookup/LicenseLookup.aspx" },
  CT: { name: "Connecticut Department of Public Health", url: "https://www.elicense.ct.gov/Lookup/LicenseLookup.aspx" },
  DE: { name: "Delaware Division of Professional Regulation", url: "https://dpr.delaware.gov/verify/" },
  DC: { name: "DC Health — License Search", url: "https://doh.dc.gov/service/health-professional-licensing-services" },
  FL: { name: "Florida DBPR", url: "https://www.myfloridalicense.com/wl11.asp" },
  GA: { name: "Georgia Composite Medical Board", url: "https://gateway.medicalboard.gov.georgia.gov/verification/search.aspx" },
  HI: { name: "Hawaii Medical Board", url: "https://pvl.ehawaii.gov/pvlsearch/app" },
  ID: { name: "Idaho Board of Medicine", url: "https://bom.idaho.gov/BOMPortal/Verification.aspx" },
  IL: { name: "Illinois Department of Financial and Professional Regulation", url: "https://online-dfpr.micropact.com/Lookup/LicenseLookup.aspx" },
  IN: { name: "Indiana Professional Licensing Agency", url: "https://mylicense.in.gov/everification/" },
  IA: { name: "Iowa Board of Medicine", url: "https://eservices.iowa.gov/PublicPortal/Iowa/IBM/Medical/Verification" },
  KS: { name: "Kansas Board of Healing Arts", url: "https://www.kansas.gov/ssrv-ksbhada/search.html" },
  KY: { name: "Kentucky Board of Medical Licensure", url: "https://kbml.ky.gov/physician/Pages/default.aspx" },
  LA: { name: "Louisiana State Board of Medical Examiners", url: "https://www.lsbme.la.gov/content/licensee-search" },
  ME: { name: "Maine Board of Licensure in Medicine", url: "https://www.pfr.maine.gov/ALMSOnline/ALMSQuery/SearchIndividual.aspx" },
  MD: { name: "Maryland Board of Physicians", url: "https://www.mbp.state.md.us/bpqapp/" },
  MA: { name: "Massachusetts Board of Registration in Medicine", url: "https://checkalicense.hhs.state.ma.us/mylicenseverification/" },
  MI: { name: "Michigan Department of Licensing and Regulatory Affairs", url: "https://www.lara.michigan.gov/colaLicVerify/" },
  MN: { name: "Minnesota Board of Medical Practice", url: "https://mn.gov/boards/medical-practice/license-verification/" },
  MS: { name: "Mississippi State Board of Medical Licensure", url: "https://gateway.msbml.ms.gov/verification/search.aspx" },
  MO: { name: "Missouri Board of Registration for the Healing Arts", url: "https://pr.mo.gov/licensee-search.asp" },
  MT: { name: "Montana Board of Medical Examiners", url: "https://ebiz.mt.gov/POL/" },
  NE: { name: "Nebraska Department of Health and Human Services", url: "https://www.nebraska.gov/LISSearch/search.cgi" },
  NV: { name: "Nevada State Board of Medical Examiners", url: "https://medboard.nv.gov/Resources/VerifyLicense/" },
  NH: { name: "New Hampshire Board of Medicine", url: "https://forms.nh.gov/licenseverification/" },
  NJ: { name: "New Jersey Division of Consumer Affairs", url: "https://newjersey.mylicense.com/verification/" },
  NM: { name: "New Mexico Medical Board", url: "https://www.nmmb.state.nm.us/verify/" },
  NY: { name: "NYSED Office of the Professions", url: "https://www.op.nysed.gov/verification-search" },
  NC: { name: "North Carolina Medical Board", url: "https://portal.ncmedboard.org/verification/search.aspx" },
  ND: { name: "North Dakota Board of Medicine", url: "https://www.ndbom.org/public/find_verify/find_verify.php" },
  OH: { name: "Ohio Medical Board", url: "https://elicense.ohio.gov/oh_verifylicense" },
  OK: { name: "Oklahoma State Board of Medical Licensure", url: "https://www.okmedicalboard.org/search" },
  OR: { name: "Oregon Medical Board", url: "https://omb.oregon.gov/search" },
  PA: { name: "Pennsylvania Licensing System", url: "https://www.pals.pa.gov/" },
  RI: { name: "Rhode Island Department of Health", url: "https://health.ri.gov/licenses/detail.php" },
  SC: { name: "South Carolina Board of Medical Examiners", url: "https://verify.llronline.com/LicLookup/Med/Med.aspx" },
  SD: { name: "South Dakota Board of Medical and Osteopathic Examiners", url: "https://www.sdbmoe.gov/verify/" },
  TN: { name: "Tennessee Department of Health", url: "https://apps.health.tn.gov/Licensure/" },
  TX: { name: "Texas Medical Board", url: "https://profile.tmb.state.tx.us/" },
  UT: { name: "Utah Division of Professional Licensing", url: "https://secure.utah.gov/llv/search/index.html" },
  VT: { name: "Vermont Board of Medical Practice", url: "https://secure.professionals.vermont.gov/prweb/PRServletCustom/V9hyUc8bCR3C1NjDMeVaA6FWfKPENHWC*/!STANDARD" },
  VA: { name: "Virginia Board of Medicine", url: "https://dhp.virginiainteractive.org/Lookup/Index" },
  WA: { name: "Washington Medical Commission", url: "https://fortress.wa.gov/doh/providercredentialsearch/" },
  WV: { name: "West Virginia Board of Medicine", url: "https://wvbom.wv.gov/public/search/" },
  WI: { name: "Wisconsin DSPS License Lookup", url: "https://licensesearch.wi.gov/" },
  WY: { name: "Wyoming Board of Medicine", url: "https://wyomedboard.wyo.gov/public/verification" },
};

const DEFAULT_BOARD: BoardInfo = {
  name: "State medical licensing board",
  url: "https://www.fsmb.org/contact-a-state-medical-board/",
};

export function getStateBoardUrl(state: string): string {
  const code = state.trim().toUpperCase();
  return STATE_BOARDS[code]?.url ?? DEFAULT_BOARD.url;
}

export function getStateBoardName(state: string): string {
  const code = state.trim().toUpperCase();
  return STATE_BOARDS[code]?.name ?? DEFAULT_BOARD.name;
}

/** Human-readable certification line for a state's licensing authority. */
export function getStateBoardCertificationLabel(state: string): string {
  return `${getStateBoardName(state)} — user verification recommended`;
}

/** Data source line referencing the state board lookup. */
export function getStateBoardDataSourceLabel(state: string): string {
  return `${getStateBoardName(state)} — verification recommended`;
}
