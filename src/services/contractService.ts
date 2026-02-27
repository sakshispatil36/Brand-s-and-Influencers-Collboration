import jsPDF from "jspdf";

interface ContractData {
  brandName: string;
  influencerName: string;
  campaignTitle: string;
  paymentTerms: string;
  deliverables: string;
  timeline: string;
  cancellationPolicy: string;
}


export const generateContractPDF = (data: ContractData): string => {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Influencer Collaboration Agreement", 20, 20);

  doc.setFontSize(12);
  doc.text(`Brand: ${data.brandName}`, 20, 40);
  doc.text(`Influencer: ${data.influencerName}`, 20, 50);
  doc.text(`Campaign: ${data.campaignTitle}`, 20, 60);

  doc.text("Payment Terms:", 20, 80);
  doc.text(data.paymentTerms, 20, 90);

  doc.text("Deliverables:", 20, 110);
  doc.text(data.deliverables, 20, 120);

  doc.text("Timeline:", 20, 140);
  doc.text(data.timeline, 20, 150);

  doc.text("Cancellation Policy:", 20, 170);
  doc.text(data.cancellationPolicy, 20, 180);

  // RETURN PDF URL instead of downloading
  return doc.output("bloburl").toString();
};
