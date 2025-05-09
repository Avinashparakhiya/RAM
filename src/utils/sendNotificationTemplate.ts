import { LeaveType } from "../user/entities/leave.entity";

export const onboardTemplate = (name: string, email: string, password: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Platform</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .header {
            text-align: center;
            background-color: #007bff;
            color: white;
            padding: 10px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Our Platform</h1>
        </div>
        <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>We are thrilled to have you join us at <strong>RAM</strong>! 🎉</p>
            <p>Your login credentials are as follows:</p>
            <ul>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Password:</strong> ${password}</li>
            </ul>
            <p>Please ensure you keep your login details safe and secure.</p>
            <p>Feel free to explore all the features and resources we offer. If you have any questions or need assistance, our support team is here to help.</p>
            <p>Once again, welcome aboard! We look forward to supporting your journey.</p>
            <p>Warm regards,</p>
            <p>
                <strong>RAM</strong><br>
            </p>
        </div>
        <div class="footer">
            <p>&copy; 2025 RAM. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const accountUpdateTemplate = (
    name: string,
    updatedFields: { email?: string; password?: boolean; name?: string, manager?: string }
): string => {
    const updatedDetails = [];

    if (updatedFields.name) {
        updatedDetails.push(`<li><strong>Name:</strong> ${updatedFields.name} (updated)</li>`);
    }
    if (updatedFields.email) {
        updatedDetails.push(`<li><strong>Email:</strong> ${updatedFields.email} (updated)</li>`);
    }
    if (updatedFields.password) {
        updatedDetails.push(`<li><strong>Password:</strong> (updated)</li>`);
    }
    if (updatedFields.manager) {
        updatedDetails.push(`<li><strong>Manager:</strong> True (updated)</li>`);
    }

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Update Notification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border: 1px solid #ddd;
              border-radius: 8px;
          }
          .header {
              text-align: center;
              background-color: #007bff;
              color: white;
              padding: 10px;
              border-radius: 8px 8px 0 0;
          }
          .content {
              padding: 20px;
          }
          .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 0.9em;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Account Update Notification</h1>
          </div>
          <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              <p>The following updates have been made to your account:</p>
              <ul>
                  ${updatedDetails.join("")}
              </ul>
              <p>If you did not request these changes, please contact our support team immediately.</p>
              <p>Warm regards,</p>
              <p>
                  <strong>RAM</strong><br>
              </p>
          </div>
          <div class="footer">
              <p>&copy; 2025 RAM. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>`;
};

export const leaveRequestTemplate = (
  name: string,
  startDate: string,
  endDate: string,
  leaveType: LeaveType,
  viewUrl: string
): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Leave Request</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          }
          .header {
              text-align: center;
              background-color: #007bff;
              color: white;
              padding: 10px;
              border-radius: 8px 8px 0 0;
          }
          .content {
              padding: 20px;
          }
          .actions {
              margin-top: 20px;
              text-align: center;
          }
          .button {
              display: inline-block;
              padding: 12px 24px;
              font-size: 16px;
              border-radius: 5px;
              text-decoration: none;
              color: white;
              background-color: #007bff;
          }
          .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 0.9em;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h2>New Leave Request</h2>
          </div>
          <div class="content">
              <p>Dear Manager,</p>
              <p><strong>${name}</strong> has submitted a leave request with the following details:</p>
              <ul>
                  <li><strong>Leave Type:</strong> ${leaveType}</li>
                  <li><strong>Start Date:</strong> ${startDate}</li>
                  <li><strong>End Date:</strong> ${endDate}</li>
              </ul>
              <div class="actions">
                  <a href="${viewUrl}" class="button">View Leave Request</a>
              </div>
              <p style="margin-top: 20px;">Please login to the system to take appropriate action.</p>
          </div>
          <div class="footer">
              <p>&copy; 2025 RAM. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};
