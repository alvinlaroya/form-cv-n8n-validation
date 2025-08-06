import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const pdfCoApiUrl = process.env.PDFCO_API_URL;
    const pdfCoKey = process.env.PDFCO_KEY;
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    const n8nWebhookUrlProd = process.env.N8N_WEBHOOK_URL_PROD;
    const formData = await request.formData();
    const cvFormData = new FormData();
    const file = formData.get("file") as File
    cvFormData.append("file", file);

    try {
        // upload pdf and retreive url
        const cvUploadReponse = await fetch(`${pdfCoApiUrl}/file/upload`, {
            method: "POST",
            headers: {
                "x-api-key": pdfCoKey
            },
            body: cvFormData,
        });

        const result = await cvUploadReponse.json();
        formData.append("cv", result.url);

        // n8n validations
        const response = await fetch(
            `${n8nWebhookUrlProd}`,
            {
                method: "post",
                body: formData,
            },
        );

        const validateResult = await response.json();

        return NextResponse.json({
            validation: validateResult,
            cvUrl: result.url
        }, { status: 201 });
    } catch (error) {
        console.log("Error on validating form", error);
    }

}
