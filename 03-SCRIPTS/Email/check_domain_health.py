import dns.resolver

def check_txt_record(domain, prefix):
    try:
        answers = dns.resolver.resolve(domain, 'TXT')
        for rdata in answers:
            txt_string = rdata.to_text().strip('"')
            if txt_string.startswith(prefix):
                return txt_string
    except Exception:
        pass
    return None

def main():
    print("========================================")
    print(" DOMAIN HEALTH AUDIT: airbnbmotion.studio")
    print("========================================\n")
    
    domain = "airbnbmotion.studio"
    
    # 1. SPF Check
    spf = check_txt_record(domain, "v=spf1")
    if spf:
        print(f"[✅] SPF Record Found: {spf}")
    else:
        print("[❌] SPF Record MISSING! (Add TXT 'v=spf1 include:zoho.com ~all')")
        
    # 2. DKIM Check
    # Zoho default selector is 'zmail._domainkey'
    dkim_domain = f"zmail._domainkey.{domain}"
    dkim = check_txt_record(dkim_domain, "v=DKIM1")
    if dkim:
        print(f"[✅] DKIM Record Found: {dkim[:40]}...")
    else:
        print("[⚠️] DKIM Record Not Found at 'zmail._domainkey'. (Check Zoho Admin console for the exact selector)")
        
    # 3. DMARC Check
    dmarc_domain = f"_dmarc.{domain}"
    dmarc = check_txt_record(dmarc_domain, "v=DMARC1")
    if dmarc:
        print(f"[✅] DMARC Record Found: {dmarc}")
    else:
        print("[❌] DMARC Record MISSING! (Add TXT at _dmarc.airbnbmotion.studio: 'v=DMARC1; p=none;')")
        
    print("\n========================================")
    print(" RESULTADO:")
    if spf and dmarc:
        print(" Si ves SPF y DMARC en verde, tu dominio está bien configurado.")
        print(" Tus correos llegarán a la BANDEJA PRINCIPAL y no a Spam.")
    else:
        print(" Falta configurar registros. Ve a Name.com y agrega los registros faltantes.")
    print("========================================")

if __name__ == "__main__":
    main()
